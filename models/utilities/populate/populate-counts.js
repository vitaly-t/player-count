var request = require('request');
var promise = require('promise');

// Use 'rootpath' module so subsequent requires are made relative to root path.
require('rootpath')();
var apiInfo = require('config/api');
var db = require('config/db');
var tables = require('config/tables');

function populateCounts(req,res){
  var URL = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=' + apiInfo.key + '&appid=';
  var index = 0;
  var appids = [];
  function shouldContinue(){
    index++;
    if(index < appids.length){
      makeRequest(appids[index]);
    }
  }
  function makeRequest(appid){
    request(URL + appid.appid, function(err, apiReq, apiRes){
      if(err) throw err;
      var count = JSON.parse(apiRes).response.player_count;
      db.none("UPDATE " + tables.main + " SET count=array_append(count,$1) WHERE appid=($2)", [count, appid.appid])
        .then(function(){
          shouldContinue();
        })
        .catch(function(err){
          console.log(err);
          res.status(500).send("ERROR! " + err);
        });
    });
  }

  db.any("SELECT appid FROM " + tables.main, [true])
    .then(function(data){
      appids = data;
      makeRequest(appids[index]);
    })
    .catch(function(err){
      console.log("ERROR:",err);
    });

}
module.exports = populateCounts;

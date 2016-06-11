var request = require('request');
var apiInfo = require('../../config/api');
var promise = require('promise');

// DATABASE
var db = require('../../config/db');

function updateCounts(req,res){
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
    console.log("Making request: ", index);
    console.log("With Datum:", appid);
    request(URL + appid.appid, function(err, apiReq, apiRes){
      if(err) throw err;
      var count = JSON.parse(apiRes).response.player_count;
      db.none("UPDATE player_counts SET count=($1) WHERE appid=($2)", [count, appid.appid])
        .then(function(){
          console.log("Record updated: " + appid.appid);
          shouldContinue();
        })
        .catch(function(err){
          console.log(err);
          res.status(500).send("ERROR! " + err);
        });
    });
  }

  db.any("SELECT appid FROM player_counts", [true])
    .then(function(data){
      appids = data;
      makeRequest(appids[index]);
    })
    .catch(function(err){
      console.log("ERROR:",err);
    });

}
module.exports = updateCounts;

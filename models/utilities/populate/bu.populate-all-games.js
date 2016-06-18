require('rootpath')();
var key = require('config/api').key;
var Inserts = require('models/utilities/helpers/inserts');
var request = require('request');
var db = require('config/db');
var tables = require('config/tables');

function populateAllGames(){
  var URL = 'http://api.steampowered.com/ISteamApps/GetAppList/v2/?key=' + key;
  var LIMIT = 10000;
  var invalidDescriptors = ["trial", "key", "demo", "trailer", "dlc", "skins", "pack", "ost"];
  var games = [];

  request.get(URL, function(err, apiReq, apiRes){
    if(err) throw err;
    var apps = JSON.parse(apiRes).applist.apps;
    var groupIndex = 0;
    for(var i = 0; i < Math.floor(apps.length / LIMIT); i++){
      games[i] = [];
    }
    for(var k = 0; k < apps.length; k++){
      // Check if the name does NOT contain any invalid descriptors
      if(!invalidDescriptors.some(function(descriptor){ return apps[k].name.toLowerCase().indexOf(descriptor) != -1;})){
        apps[k].name.replace("'","''");
        if(games[groupIndex].length !== 0 && games[groupIndex].length % LIMIT === 0){
          groupIndex++;
        }
        games[groupIndex].push(apps[k]);
      }
    }
    var valuesIndex = 0;
    var values = new Inserts('${appid}, ${name}', games[valuesIndex]);
    var start = Date.now();
    performInsert(values);

    function performInsert(values){
      var query = 'INSERT INTO ' + tables.main + ' VALUES $1';
      if(valuesIndex === 0) console.log(games[valuesIndex][0]);
      db.none(query, values)
        .then(function(data){
          valuesIndex++;
          if(valuesIndex < games.length){
            values = new Inserts('${appid}, ${name}', games[valuesIndex]);
            performInsert(values);
          }
          else{
            var end = Date.now();
            console.log('Time taken ', end - start);
          }
        })
        .catch(function(err){
          console.log(err);
        });
    }

  });
}

module.exports = populateAllGames;

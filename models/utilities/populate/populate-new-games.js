require('rootpath')();
var key = require('config/api').key;
var Inserts = require('models/utilities/helpers/inserts');
var request = require('request');
var db = require('config/db');
var tables = require('config/tables');
var pgp = require('pg-promise')();

function populateNewGames(){
  var URL = 'http://api.steampowered.com/ISteamApps/GetAppList/v2/?key=' + key;
  var LIMIT = 1000;
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
    var start = Date.now();
    var newIDS = [];
    performInsert();

    var total = 0;
    function performInsert(values){
      var potentialIDS = pgp.helpers.values(games[valuesIndex],['appid','name']);
      var query = 'WITH temp(appid,name) AS (VALUES '  + potentialIDS + ') SELECT temp.appid,temp.name FROM temp WHERE temp.appid NOT IN (SELECT appid FROM games)';
      db.task(function(t){
        return t.any(query)
          .then(function(newIds){
            if(newIds.length !== 0){
              return t.none(pgp.helpers.insert(newIds,['appid','name'],tables.games));
            }
          });
        })
        .then(function(){
          valuesIndex++;
          if(games[valuesIndex].length !== 0){
            performInsert();
          }
          else{
            //var newIDS = pgp.helpers.values(newIDS,['appid','name']);
            //console.log(newIDS);
            var end = Date.now();
            console.log('Time taken ',end - start,' ms');
          }
        })
        .catch(function(err){
          console.log(err);
        });
          
//      db.any(query)
//        .then(function(data){
//          valuesIndex++;
//          newIDS.push(data);
//          if(games[valuesIndex].length !== 0){
//            performInsert();
//          }
//          else{
//            var newIDS = pgp.helpers.values(newIDS,['appid','name']);
//            console.log(newIDS);
//            var end = Date.now();
//            console.log('Time taken ', end - start);
//          }
//        })
//        .catch(function(err){
//          console.log(err);
//        });
    }

  });
}

module.exports = populateNewGames;

var express = require('express');
var path = require('path');
var request = require('request');
var pg = require('pg');

var apiInfo = require('./config/api');
var key = apiInfo.key;
var origin = apiInfo.origin;

var Inserts = require('./functions/inserts');

var app = express();

app.set('view engine', 'pug');

// Prettify JSON
app.set('json spaces', 2);

app.get('/', function(req, res){
  //var url = 'http://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=' + key + '&steamid=' + origin + '&relationship=friend';
  //var url = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=' + key + '&appid=440';
  var url = 'http://api.steampowered.com/ISteamApps/GetAppList/v2/?key=' + key;
  var MAX_POOL_SIZE = 20;

  request.get(url, function(err, apiReq, apiRes){
    if(err) throw err;
    var apps = JSON.parse(apiRes).applist.apps;
    var games = [];
    var invalidDescriptors = ["trial", "key", "demo", "trailer", "dlc", "skins", "pack"];
    for(var k = 0; k < apps.length; k++){
      // Check if the name does NOT contain any invalid descriptors
      if(!invalidDescriptors.some(function(descriptor){ return apps[k].name.toLowerCase().indexOf(descriptor) != -1;})){
        games.push([parseInt(apps[k].appid), (apps[k].name).toString()]);
      }
    }
    pg.defaults.poolSize = 25;

    pg.connect('postgres://localhost:5432/steam', function(err, client, done){
      if(err){
        done();
        console.log(err);
        return res.status(500).json({success:false, data:err});
      }

      var count = 0;

      var release = function(){
        done();
        count++;
        if(count < games.length){
          insertGame(games[count]);
        }
        else{
          return res.send({success:true});
        }
      };

      var insertGame = function(game){
        client.query("INSERT INTO player_counts (appid,name) VALUES ($1,$2)", game, function(err){
          if(err){
            done();
            console.log(err);
            return res.status(500).json({success:false,data:err});
          }
          console.log(count);
          release();
        });
      };

      for(var i = 0; i < 25; i++){
        insertGame(games[count]);
      }

    });
  });
});


app.listen(8080, function(){
  console.log("Listening on port 8080");
});

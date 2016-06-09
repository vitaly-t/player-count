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

  request.get(url, function(err, apiReq, apiRes){
    if(err) throw err;
    var apps = JSON.parse(apiRes).applist.apps;
    var placeholders = "";
    for(var i = 1; i < apps.length+1; i++){
      var j = i + 1;
      placeholders+="($"+i+",$"+j+"),";
    }
    placeholders = placeholders.substring(0,placeholders.length-1);
    var query = "INSERT INTO player_counts (appid,name) VALUES " + placeholders;
    console.log(query);
    pg.connect('postgres://localhost:5432/steam', function(err, client, done){
      if(err){
        done();
        console.log(err);
        return res.status(500).json({success:false, data:err});
      }
      
      return res.json({success:true});
    });
  });
});


app.listen(8080, function(){
  console.log("Listening on port 8080");
});

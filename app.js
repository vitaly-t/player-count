var express = require('express');
var path = require('path');
var request = require('request');
var pgp = require('pg-promise')();

var apiInfo = require('./config/api');
var key = apiInfo.key;

var db = pgp("postgres://localhost:5432/steam");

var app = express();

app.set('view engine', 'pug');

// Prettify JSON
app.set('json spaces', 2);

app.get('/', function(req, res){
  //var url = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=' + key + '&appid=440';
  db.any("SELECT * FROM player_counts", [true])
    .then(function(data){
      res.json(data);
    })
    .catch(function(err){
      if(err){
        done();
        console.log(err);
        res.status(500).json({success:false, data:err});
      }
    });
  
});


app.listen(8080, function(){
  console.log("Listening on port 8080");
});

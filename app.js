var express = require('express');
var path = require('path');
var request = require('request');
var pgp = require('pg-promise')();

// STREAMING
var QueryStream = require('pg-query-stream');
var JSONStream = require('JSONStream');
var qs = new QueryStream("SELECT * FROM player_counts");

var apiInfo = require('./config/api');
var key = apiInfo.key;

var db = pgp("postgres://localhost:5432/steam");

var app = express();

app.set('view engine', 'pug');

// Prettify JSON
app.set('json spaces', 2);

app.get('/', function(req, res){
  //var url = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=' + key + '&appid=440';
  res.write("Retrieving game data ... ");
  db.stream(qs, function(s){
    s.pipe(JSONStream.stringify()).pipe(res);
  })
    .then(function(data){
      console.log("Total rows processed:", data.processed);
      console.log("Duration in milliseconds:",data.duration);
    })
    .catch(function(err){
      console.log("ERROR", err.message || error);
    });
//  db.any("SELECT * FROM player_counts", [true])
//    .then(function(data){
//      res.end(data);
//    })
//    .catch(function(err){
//      if(err){
//        done();
//        console.log(err);
//        res.status(500).json({success:false, data:err});
//      }
//    });
  
});


app.listen(8080, function(){
  console.log("Listening on port 8080");
});

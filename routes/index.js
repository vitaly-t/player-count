var express = require('express');
var router = express.Router();
// STREAMING
var QueryStream = require('pg-query-stream');
var JSONStream = require('JSONStream');
var qs = new QueryStream("SELECT * FROM player_counts");
// DATABASE
var db = require('../config/db');


router.get('/', function(req, res){
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
  
});

module.exports = router;

var express = require('express');
var router = express.Router();
var cache = require('../config/cache');

// STREAMING
var QueryStream = require('pg-query-stream');
var JSONStream = require('JSONStream');
// 'through2-map' allows for a array.map like function to transform chunks from
// a stream.
var map = require('through2-map');

// DATABASE
var db = require('../config/db');
var minPopForUpdating = require('../config/global').minPopForUpdating;

// OTHER ROUTES
router.use('/api', require('./api'));

// OTHER VALUES
var svgDims = require('../config/global').svgDims;

//router.get('/', function(req,res){
//  var populateAllGames = require('../models/utilities/populate/populate-all-games');
//  populateAllGames();
//});

router.get('/', function(req,res){
  var getTrending = require('../functions/get-trending');
  var total = 0;
  var games = cache.get("highPopGames").map(function(game){
    var max = Math.max.apply(null, game.count);
    game.max = max;
    total += game.count[game.count.length-1];
    game.heights = game.count.map(function(count){
      return Math.floor((count / max) * svgDims.height);
    });
    return game;
  });
  var trending = getTrending(games);
  res.render('index', {total: total, trending: trending, games:games, svgDims: svgDims});
});

router.get('/test', function(req, res){
  // Initially had this outside of router callback. Oops.
  var query = "SELECT * FROM player_counts WHERE " + minPopForUpdating + " < ANY(count) ORDER BY count DESC";
  var qs = new QueryStream(query);
  //var url = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=' + key + '&appid=440';
  // NOTE: If you provide a callback to render, the rendered HTML will NOT be
  // sent automatically.
  // As such, it is possible to do something like the below - we render the
  // 'index' view, write it to the response, and then connect a stream of data
  // from the database TO the response object.
  // This streamed information will AUTOMATICALLY be inserted into the body of
  // the rendered HTML.
  
  // We use 'through2-map' here to create usable HTML to display info streamed
  // from the database.
  // NOTE: We use {objectMode:true} so that we can select properties from each
  // chunk (each chunk is a single JSON object corresponding to a row in the
  // DB.
  var test = map({objectMode:true}, function(chunk){
    return "<li><h1>" + "ID: " + chunk.id + ", Name: " + chunk.name + ", Count: " + chunk.count + "</h1></li>";
  });

  res.render('index', {heights: [20,80,150,38,148]}, function(err, html){
    res.write(html);
    res.write("<ol>");
    db.stream(qs, function(s){
      // NOTE: JSONStream.stringify() returns an ARRAY containing JSON objects.
      // As it is easier to handle single JSON objects in our 'through2-map'
      // function, we elect to pipe the chunks as is.
      //s.pipe(JSONStream.stringify()).pipe(test).pipe(res);
      if(!res.headerSent){
        s.pipe(test).pipe(res);
      }
    })
      .then(function(data){
        console.log("Total rows processed:", data.processed);
        console.log("Duration in milliseconds:",data.duration);
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // WHEN I INCLUDE THESE I GET THAT HEADERS HAVE ALREADY BEEN SENT!
        //res.write("</ol>");
        //res.end();
      })
      .catch(function(err){
        console.log("ERROR", err.message || error);
      });
  });
  
});

module.exports = router;

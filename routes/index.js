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

// FUNCTIONS
var getTrending = require('../functions/get-trending');
var get30DayAvg = require('../functions/get-30-day-avg');
var getScaledHeights = require('../functions/get-scaled-heights');
var getSpecificGame = require('../models/utilities/get/get-specific-game');

router.get('/', function(req,res){
  var topGames = cache.get("topGames");
  var totalPlayers = cache.get("totalPlayers");
  var games = cache.get("highPopGames").map(function(game){

    game.avg = get30DayAvg(game.count);
    game.max = Math.max.apply(null,game.count);
    game.heights = {};

    game.heights.bargraph = getScaledHeights(game.count,svgDims.bargraph.height);
    return game;
  });
  var trending = getTrending(games);
  res.render('index', {totalPlayers: totalPlayers, trending: trending, games:games.slice(0,10), topGames: topGames, svgDims: svgDims});
});

router.get('/search/',function(req,res){
  var search = req.query.search;
  var results = cache.get("highPopGames").filter(function(game){  return game.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;  });
  results = results.map(function(game){
    game.avg = (game.count.reduce(function(total,curr){ return total + curr; }) / game.count.length).toFixed(2);
    game.gain = game.count[game.count.length-1] - game.count[0];
    game.gainPercent = ((game.count[game.count.length-1] / game.count[0] * 100) - 100).toFixed(2) + "%";
    return game;
  });
  res.render('search',{results:results});
});

router.get('/app/:appid',function(req,res){
  var appid = req.params.appid;
  var game = cache.get("highPopGames").filter(function(game){  return game.appid == appid;  })[0];
  getSpecificGame(appid,function(err,monthlyPerf){
    monthlyPerf.map(function(month,index,arr){
      if(index === 0){
        month.gain = '-';
        month.gainPercent = '-';
      }
      else{
        month.gain = month.avg - arr[index-1].avg;
        month.gainPercent = month.avg / arr[index-1].avg * 100;
      }
    });
    res.render('app',{game:game, monthlyPerf: monthlyPerf});
  });
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

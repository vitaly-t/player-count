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

// OTHER VALUES
var svgDims = require('../config/global').svgDims;

// FUNCTIONS
var getTrending = require('../functions/get-trending');
var get30DayAvg = require('../functions/get-30-day-avg');
var getScaledHeights = require('../functions/get-scaled-heights');
var getSpecificGame = require('../models/utilities/get/get-specific-game');

// CONSTANTS
var NUM_LINKS = 50;

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
  res.render('top', {games:games.slice(0,NUM_LINKS),nextPage:1,prevPage:null,startIndex:0,svgDims: svgDims});
});

router.get('/page/:page', function(req,res){
  var page = parseInt(req.params.page);
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
  var start = (page-1) * NUM_LINKS;
  var end = start + NUM_LINKS;
  var prevPage = (page === 1) ? null : page - 1;
  if(end < games.length){
    var nextPage = page + 1;
    res.render('top', {games:games.slice(start,end),nextPage:nextPage,prevPage:prevPage,startIndex:start,svgDims: svgDims});
  }
  else{
    var nextPage = null;
    res.render('top',{games:games.slice(start,games.length),nextPage:nextPage,prevPage:prevPage,startIndex:start,svgDims:svgDims});
  }

});

module.exports = router;

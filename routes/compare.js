var express = require('express');
var router = express.Router();
var cache = require('../config/cache');
var async = require('async');

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
var imgDims = require('../config/images').headerImage;

// FUNCTIONS
var getTrending = require('../functions/get-trending');
var get30DayAvg = require('../functions/get-30-day-avg');
var getScaledHeights = require('../functions/get-scaled-heights');
var getSpecificGame = require('../models/utilities/get/get-specific-game');

// CONSTANTS
var NUM_LINKS = 50;

router.get('/:appids',function(req,res){
  var appids = req.params.appids;
  if(appids.indexOf(',') === -1){
    appids = [].concat(appids);
  }
  else{
    appids = appids.split(',');
    if(appids.length > 4){
      appids = appids.slice(-4);
    }
  }
  appids = appids.map(function(appid){ return parseInt(appid); });

  getGamesFromCache(appids,function(err,games){
    if(!err){
      res.render('compare',{games: games, appids: appids, imgDims:imgDims});
    }
    else{
      console.log(err);
    }
  });
});

router.get('/',function(req,res){
  res.render('compare',{games: [], appids: [], imgDims:imgDims});
});

function getGamesFromCache(appids,cb){
  cache.get("highPopGames",function(err,results){
    if(err) return cb(err);
    var selected = results.filter(function(game){ 
      return appids.indexOf(game.appid) !== -1; 
    });
    cb(null,selected);
  });
}

module.exports = router;

var express = require('express');
var path = require('path');
var http = require('http');
var async = require('async');

// Increase max number of requests
http.globalAgent.maxSockets = 20;

// DATABASE FUNCTIONS
var getHighPopGames = require('./models/utilities/get/get-high-pop-games');
var updatePlayerCounts = require('./models/utilities/update/update-player-counts');
var getCurrPlayerCounts = require('./models/utilities/get/get-curr-player-counts');

// CACHE FUNCTIONS
var cleanAndRepopulateCache = require('./functions/clean-and-repopulate-cache');

// CRON
var CronJob = require('cron').CronJob;
// NOTE: Date's are given by 'sec min hour day month dayOfWeek' format
new CronJob('40 32 00 * * 0-6', function(){
  if(cache.get("highPopGames")){
    console.log("Updating player counts for most-played games...");

    getCurrPlayerCounts(cache.get("highPopGames"), function(err, games){
      updatePlayerCounts(games, function(err, data){
        console.log("Records updated for the day.");
        cleanAndRepopulateCache(cache);
        });
    });
  }
}, null, true, 'America/Los_Angeles');
// NOTE: Had previously tried use CronJob constructor with JSON argument.
// Didn't work ('this.source' was undefined). Stick to the above form.

// CACHE
var cache = require('./config/cache');

// API
var apiInfo = require('./config/api');
var key = apiInfo.key;

// INITIALIZE APP
var app = express();

// LOCALS
app.locals.moment = require('moment');

// APP PROPERTIES
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

// MIDDLEWARES
// NOTE: APPLICATION-LEVEL MIDDLEWARES SHOULD ALWAYS GO BEFORE SETTING UP THE
// ROUTES.
// Application-level middlewares without a mount path are executed on every
// request.

// ROUTES
app.use('/', require('./routes/index'));

app.listen(8080, function(){
  console.log("Listening on port 8080");
  if(!cache.get("highPopGames")){
    var getHighPopGames = require('models/utilities/get/get-high-pop-games');
    var getTopGames = require('models/utilities/get/get-top-games');
    console.log("Creating cache element ...");
    getHighPopGames(function(err, games){
      if(!err){
        cache.set("highPopGames", games, 86400);
        getTopGames(function(err,games){
          if(!err){
            cache.set("topGames", games, 86400);
          }
        });
      }
    });
  }
});

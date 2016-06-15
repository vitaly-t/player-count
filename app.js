var express = require('express');
var path = require('path');
var http = require('http');

// GLOBALS
GLOBAL.__base = __dirname + '/';

// Increase max number of requests
http.globalAgent.maxSockets = 20;

// CRON
var CronJob = require('cron').CronJob;
// NOTE: Use */num to indicate that the job should execute every num amount of
// time.
new CronJob('* * * */1 * *', function(){
  if(cache.get("lastUpdated")){
    console.log(cache.get("lastUpdated"));
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

// APP PROPERTIES
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

// MIDDLEWARES
// NOTE: APPLICATION-LEVEL MIDDLEWARES SHOULD ALWAYS GO BEFORE SETTING UP THE
// ROUTES.
// Application-level middlewares without a mount path are executed on every
// request.
//app.use(function(req, res, next){
//  console.log("Last updated on: ");
//  console.log(cache.get("lastUpdate"));
//  next();
//});

// ROUTES
app.use('/', require('./routes/index'));

app.listen(8080, function(){
  console.log("Listening on port 8080");
  query.select("name342", "player_counts", "count > 5000", 100, {field: "count", dir: "DESC"}, function(err,data){
    if(err){
      console.log("Unable to query database.");
    }
    data.forEach(function(elem){
      console.log(elem.name);
    });
  });
  if(!cache.get("lastUpdated")){
    console.log("Creating cache element ...");
    cache.set("lastUpdated", { time: Date.now() }, 100);
  }
});

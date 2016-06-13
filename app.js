var express = require('express');
var path = require('path');

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
  if(!cache.get("lastUpdate")){
    console.log("Creating cache element ...");
    cache.set("lastUpdate", { time: Date.now() }, 100);
  }
});

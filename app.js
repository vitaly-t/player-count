var express = require('express');
var path = require('path');

// CACHE
var NodeCache = require('node-cache');

// API
var apiInfo = require('./config/api');
var key = apiInfo.key;

// INITIALIZE APP
var app = express();

// APP PROPERTIES
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

// ROUTES
app.use('/', require('./routes/index'));

app.listen(8080, function(){
  console.log("Listening on port 8080");
});

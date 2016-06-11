var express = require('express');
var router = express.Router();
var stream = require('express-stream');
// STREAMING
var QueryStream = require('pg-query-stream');
var JSONStream = require('JSONStream');
var qs = new QueryStream("SELECT * FROM player_counts ORDER BY count DESC LIMIT 10");
// DATABASE
var db = require('../config/db');

// OTHER ROUTES
router.use('/api', require('./api'));


router.get('/', stream.stream(),function(req, res){
  //var url = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=' + key + '&appid=440';
  // NOTE: If you provide a callback to render, the rendered HTML will NOT be
  // sent automatically.
  // As such, it is possible to do something like the below - we render the
  // 'index' view, write it to the response, and then connect a stream of data
  // from the database TO the response object.
  // This streamed information will AUTOMATICALLY be inserted into the body of
  // the rendered HTML.
  res.render('index', {}, function(err, html){
    res.write(html);
    db.stream(qs, function(s){
      s.pipe(JSONStream.stringify()).pipe(res);
    })
      .then(function(data){
        console.log("Total rows processed:", data.processed);
        console.log("Duration in milliseconds:",data.duration);
        res.end();
      })
      .catch(function(err){
        console.log("ERROR", err.message || error);
      });
  });
  
});

module.exports = router;

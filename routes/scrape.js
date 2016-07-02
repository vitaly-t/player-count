var express = require('express');
var router = express.Router();
var cache = require('../config/cache');
var async = require('async');
var urlMod = require('url');
var fs = require('fs');
var request = require('request');

// 'through2-map' allows for a array.map like function to transform chunks from
// a stream.
var map = require('through2-map');

// CONSTANTS

router.get('/', function(req,res){
  var BASE_URL = "http://cdn.akamai.steamstatic.com/steam/apps/";
  var url = BASE_URL + 570 + "/header.jpg";
  var dest = fs.createWriteStream('./test.jpg');

  request(url).pipe(dest);
  //var urls = cache.get("highPopGames").map(function(game){ return BASE_URL + game.appid + ".jpg";  });
  //var url = BASE_URL + 570;
  //request({url: url, forever: true}, function(err, response, html){
  //  if(!err && response.statusCode == 200){
  //    var $ = cheerio.load(html);
  //    $('#app-heading').filter(function(){
  //      var data = $(this);
  //    });
  //  }
  //});

//  async.map(urls, function(url, callback){
//    //var appid = urlMod.parse(url,true).query.appid;
//    request({url: url, forever: true}, function(err, response, html){
//      if(!err){
//        try{
//          var $ = cheerio.load(html);
//          $('#app-heading')
//          var updated = JSON.parse(apiRes);
//          updated.appid = appid;
//          callback(err, updated);
//        }
//        catch(e){
//          callback(new Error("Unable to parse response from requested URL."));
//        }
//      }
//      else{
//        callback(err);
//      }
//    });
//  }, 
//    function(err, results){
//      if(err){
//        return cb(err);
//      }
//      return cb(null, results);
//    }
//  );

});

module.exports = router;

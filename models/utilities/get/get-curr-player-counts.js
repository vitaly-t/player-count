var request = require('request');
var async = require('async');
var urlMod = require('url');

// Use 'rootpath' module so subsequent requires are made relative to root path.
require('rootpath')();
var db = require('config/db');
var apiInfo = require('config/api');

function getCurrentPlayerCounts(games, cb){
  if(!Array.isArray(games)){
    return cb(new Error("First paramter must be an array."));
  }

  var URL = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=' + apiInfo.key + '&appid=';
  var gameURLs = games.map(function(game){ return URL + game.appid; });

  async.map(gameURLs, function(url, callback){
    var appid = urlMod.parse(url,true).query.appid;
    request({url: url, forever: true}, function(err, apiReq, apiRes){
      if(!err){
        var updated = JSON.parse(apiRes);
        updated.appid = appid;
        callback(err, updated);
      }
      else{
        callback(err);
      }
    });
  }, 
    function(err, results){
      if(err){
        return cb(err);
      }
      return cb(null, results);
    }
  );
}

module.exports = getCurrentPlayerCounts;

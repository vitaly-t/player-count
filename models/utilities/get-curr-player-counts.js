var request = require('request');
var async = require('async');
var db = require('../../config/db');
var apiInfo = require('../../config/api');

function getUpdatedCounts(games, cb){
  var URL = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=' + apiInfo.key + '&appid=';
  var gameURLs = games.map(function(game){ return URL + game.appid; });
  var count = 0;
  async.map(gameURLs, function(url, callback){
    console.error(++count);
    request(url, function(err, apiReq, apiRes){
      callback(err, JSON.parse(apiRes));
    });
  }, 
    function(err, results){
      console.error(results);
      if(err){
        return cb(err);
      }
      return cb(null, results);
    }
  );
}

module.exports = getUpdatedCounts;

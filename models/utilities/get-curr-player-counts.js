var request = require('request');
var db = require('../../config/db');
var apiInfo = require('../../config/api');

function getUpdatedCounts(games, cb){
  var URL = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=' + apiInfo.key + '&appid=';
  var newCounts = [];
  games.forEach(function(game){
    setTimeout(function(){
      request(URL + game.appid, function(err, apiReq, apiRes){
        if(err){
          return cb(err);
        }
        newCounts.push(JSON.parse(apiRes));
        if(newCounts.length === games.length){
          return cb(null, newCounts);
        }
      });
    }, 50);
  });
}

module.exports = getUpdatedCounts;

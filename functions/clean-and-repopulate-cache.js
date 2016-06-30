var async = require('async');
require('rootpath')();
var getHighPopGames = require('models/utilities/get/get-high-pop-games');
var getTopGames = require('models/utilities/get/get-top-games');
var getTotalPlayers = require('models/utilities/get/get-total-players');

function cleanAndRepopulateCache(cache){
  cache.del(["highPopGames","topGames", "totalPlayers","homePage"], function(err,count){
    async.parallel([
      getHighPopGames,
      getTopGames,
      getTotalPlayers
    ],
    function(err,result){
      if(!err){
        // NOTE: The result array will contain the result of the callbacks of
        // each function specified above IN ORDER.
        cache.set("highPopGames",result[0],86400);
        cache.set("topGames",result[1],86400);
        cache.set("totalPlayers",result[1],86400);
        console.log("Cache updated!");
      }
    });
  });
}

module.exports = cleanAndRepopulateCache;

var async = require('async');
require('rootpath')();
var getHighPopGames = require('models/utilities/get/get-high-pop-games');
var getTopGames = require('models/utilities/get/get-top-games');

function cleanAndRepopulateCache(cache){
  cache.del(["highPopGames","topGames"], function(err,count){
    async.parallel([
      getHighPopGames,
      getTopGames
    ],
    function(err,result){
      if(!err){
        // NOTE: The result array will contain the result of the callbacks of
        // each function specified above IN ORDER.
        cache.set("highPopGames",result[0],86400);
        cache.set("topGames",result[1],86400);
        console.log("Cache updated!");
      }
    });
//    getHighPopGames(function(err,games){
//      if(!err){
//        cache.set("highPopGames", games, 86400);
//        getTopGames(function(err,games){
//          if(!err){
//            cache.set("topGames", games, 86400);
//            console.log("Cache updated");
//          }
//        });
//      }
//    });
  });
}

module.exports = cleanAndRepopulateCache;

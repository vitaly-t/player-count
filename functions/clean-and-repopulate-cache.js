require('rootpath')();
var getHighPopGames = require('models/utilities/get/get-high-pop-games');
var getTopGames = require('models/utilities/get/get-top-games');

function cleanAndRepopulateCache(cache){
  cache.del(["highPopGames","topGames"], function(err,count){
    getHighPopGames(function(err,games){
      if(!err){
        cache.set("highPopGames", games, 86400);
        getTopGames(function(err,games){
          if(!err){
            cache.set("topGames", games, 86400);
            console.log("Cache updated");
          }
        });
      }
    });
  });
}

module.exports = cleanAndRepopulateCache;

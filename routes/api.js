var express = require('express');
var router = express.Router();
require('rootpath')();
var populateCounts = require('models/utilities/populate/populate-counts');
var getCountsBetweenDates = require('models/utilities/get/get-counts-between-dates');
var cache = require('config/cache');

function partialSearch(name,cb){
  name = name.toLowerCase();
  cache.get('highPopGames',function(err,games){
    if(!err){
      var matches = games.filter(function(game){
        return game.name.toLowerCase().indexOf(name) !== -1;
      });
      matches.sort(function(matchA,matchB){
        if(matchA.name.toLowerCase().indexOf(name) < matchB.name.toLowerCase().indexOf(name)){
          return -1;
        }
        else if(matchA.name.toLowerCase().indexOf(name) > matchB.name.toLowerCase().indexOf(name)){
          return 1;
        }
        return;
      });
      if(matches.length > 0){
        return cb(null,{name:matches[0].name,appid:matches[0].appid});
      }
      return cb(null,null);
    }
  });
}

router.get('/populateCounts', populateCounts);
router.get('/updateCounts', populateCounts);
router.get('/partialSearch',function(req,res){
  var search = req.query.search;
  partialSearch(search,function(err,result){
    res.json(result);
  });
});
router.get('/countsBetweenDates',function(req,res){
  var start = req.query.start;
  var end = req.query.end;
  var appid = req.query.appid;
  console.log(start,end,appid);
  getCountsBetweenDates(appid,start,end,function(err,counts){
    if(!err){
      res.json(counts);
    }
    else{
      console.log(err);
    }
  });
  
});
module.exports = router;

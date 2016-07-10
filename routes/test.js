var express = require('express');
var router = express.Router();
require('rootpath')();
var queries = require('db/queries');

// CONSTANTS
var NUM_LINKS = 50;

router.get('/select/:appid',function(req,res){
  queries.getOne(req.params.appid)
  .then(function(game){
    res.status(200).json(game);
  })
  .catch(function(err){
    next(err);
  });

});

router.get('/select', function(req,res){
  queries.getAll()
  .then(function(games){
    res.status(200).json(games);
  })
  .catch(function(err){
    next(err);
  });

});

module.exports = router;

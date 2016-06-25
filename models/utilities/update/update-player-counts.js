var request = require('request');
var promise = require('promise');

// Use 'rootpath' module so subsequent requires are made relative to root path.
require('rootpath')();
var apiInfo = require('config/api');
var db = require('config/db');
var tables = require('config/tables');
var pgp = require('pg-promise')();

function updatePlayerCounts(gamesToUpdate, cb){
  if(!Array.isArray(gamesToUpdate)){
    return cb(new Error("First parameter must be an array."));
  }
  var counts = gamesToUpdate.map(function(game){
    return {appid: game.appid,count: game.response.player_count};
  });
  db.none(pgp.helpers.insert(counts, ['appid','count'],tables.counts))
    .then(function (data) {
        console.log("Records successfully updated!");
        cb(null, data);
    })
    .catch(function (err) {
        console.log("ERROR:", error.message || error);
        cb(err);
    });
}

module.exports = updatePlayerCounts;

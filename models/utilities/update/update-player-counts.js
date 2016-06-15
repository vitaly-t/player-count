var request = require('request');
var promise = require('promise');

// Use 'rootpath' module so subsequent requires are made relative to root path.
require('rootpath')();
var apiInfo = require('config/api');
var db = require('config/db');

function updatePlayerCounts(gamesToUpdate, cb){
  if(!Array.isArray(gamesToUpdate)){
    return cb(new Error("First parameter must be an array."));
  }
	db.tx(function (t) {
		var updates = gamesToUpdate.map(function(game){
			return t.none("UPDATE player_counts SET count=$1 WHERE appid=$2", [game.response.player_count, game.appid]);
		});
    var inserts = gamesToUpdate.map(function(game){
      return t.none("UPDATE player_counts SET updated = array_append(updated,$1) WHERE appid=$2", [new Date(), game.appid]);
    });
		// this = t = transaction protocol context;
		// this.ctx = transaction config + state context;
		return t.batch(updates.concat(inserts));
	})
	.then(function (data) {
		console.log("Records successfully updated!");
		cb(null, data);
})
	.catch(function (error) {
			console.log("ERROR:", error.message || error);
      cb(err);
	});
}

module.exports = updatePlayerCounts;

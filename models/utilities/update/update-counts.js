var request = require('request');
var promise = require('promise');

// Use 'rootpath' module so subsequent requires are made relative to root path.
require('rootpath')();
var apiInfo = require('config/api');
var db = require('config/db');

function updateCounts(gamesToUpdate){
	db.tx(function (t) {
		gamesToUpdate = gamesToUpdate.map(function(game){
			return t.none("UPDATE player_counts SET count=$1 WHERE appid=$2", game.response.player_count, game.appid);
		});
		// this = t = transaction protocol context;
		// this.ctx = transaction config + state context;
		return t.batch(gamesToUpdate);
	})
	.then(function (data) {
		console.log("Records successfully updated!");
			// success;
	})
	.catch(function (error) {
			console.log("ERROR:", error.message || error);
	});
}

module.exports = updateCounts;

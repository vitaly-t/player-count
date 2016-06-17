// Use 'rootpath' module so subsequent requires are made relative to root path.
require('rootpath')();
var db = require('config/db');
var popMinimum = require('config/global').minPopForUpdating;

module.exports = function(cb){
  if(!cb){
    throw new Error("Callback required.");
  }
  // NOTE: By default, the lower bound of an array in POSTGRESQL is 1. So
  // array_length also corresponds to the last index of the array.
  var query = "SELECT * FROM player_counts WHERE " + popMinimum + " < ANY(COUNT) ORDER BY count DESC";
  db.any(query)
    .then(function(data){
      return cb(null, data);
    })
    .catch(function(err){
      console.error("There was a problem accessing the database: ", err);
      return cb(err);
    });
};

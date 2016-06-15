// Use 'rootpath' module so subsequent requires are made relative to root path.
require('rootpath')();
var db = require('config/db');
var popMinimum = require('config/global').minPopForUpdating;

module.exports = function(cb){
  if(!cb){
    throw new Error("Callback required.");
  }
  var query = "SELECT * FROM player_counts WHERE count > " + popMinimum + " ORDER BY count DESC";
  db.any(query)
    .then(function(data){
      return cb(null, data);
    })
    .catch(function(err){
      console.error("There was a problem accessing the database: ", err);
      return cb(err);
    });
};

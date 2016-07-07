require('rootpath')();
var db = require('config/db');
var tables = require('config/tables');

module.exports = function(appid,cb){
  if(!cb){
    throw new Error("Callback required.");
  }
  // NOTE: By default, the lower bound of an array in POSTGRESQL is 1. So
  // array_length also corresponds to the last index of the array.
  var query = "SELECT * FROM " + tables.individual + " WHERE appid=" + appid + " ORDER BY mon ASC";
  db.any(query)
    .then(function(data){
      return cb(null, data);
    })
    .catch(function(err){
      console.error("There was a problem accessing the database: ", err);
      return cb(err);
    });
};

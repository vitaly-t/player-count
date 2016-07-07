require('rootpath')();
var db = require('config/db');
var tables = require('config/tables');

module.exports = function(name,cb){
  if(!cb){
    throw new Error("Callback required.");
  }
  var query = "SELECT * FROM " + tables.games + " WHERE name LIKE '\%"+name+"\%' ORDER BY strpos(" + name + ",name) ASC";
  db.any(query)
    .then(function(data){
      return cb(null, data);
    })
    .catch(function(err){
      console.error("There was a problem accessing the database: ", err);
      return cb(err);
    });
};

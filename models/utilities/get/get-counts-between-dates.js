require('rootpath')();
var db = require('config/db');
var tables = require('config/tables');

function formatDate(date){
  var year = date.getFullYear();
  var month = date.getUTCMonth();
  var day = date.getUTCDay();
  return year + '-' + (month <= 9 ? "0" + month : month) + '-' + (day <= 9 ? "0" + day : day);
}

module.exports = function(appid, start, end, cb) {
  if (!cb) {
    throw new Error("Callback required.");
  }
  // NOTE: By default, the lower bound of an array in POSTGRESQL is 1. So
  // array_length also corresponds to the last index of the array.
  //start = formatDate(new Date(parseInt(start)));
  //end = formatDate(new Date(parseInt(end)));
  // Need to divide by 1000 as Postgres appears to use seconds rather than
  // milliseconds when considering epoch time.
  start = start / 1000;
  end = end / 1000;
  var query = "SELECT * FROM " + tables.counts + " WHERE appid=" + appid + " AND updated > to_timestamp(" + start + ") AND updated < to_timestamp(" + end + ")";
  db.any(query)
    .then(function(data) {
      return cb(null, data);
    })
    .catch(function(err) {
      console.error("There was a problem accessing the database: ", err);
      return cb(err);
    });
};

// Use 'rootpath' module so subsequent requires are made relative to root path.
require('rootpath')();
var db = require('config/db');
var popMinimum = require('config/global').minPopForUpdating;
var tables = require('config/tables');

module.exports = function(cb){
  if(!cb){
    throw new Error("Callback required.");
  }
  // NOTE: By default, the lower bound of an array in POSTGRESQL is 1. So
  // array_length also corresponds to the last index of the array.
  //var query = "SELECT games.id,games.appid,games.name,counts.updated,counts.count FROM " + tables.games + "," + tables.counts + " WHERE games.appid=counts.appid AND " + popMinimum + " < counts.count AND counts.updated > CURRENT_DATE - INTERVAL '1 month' ORDER BY games.appid,counts.updated DESC";
  var query = "SELECT * FROM fullview";
  db.any(query)
    .then(function(data){
      var formatted = data.reduce(function(total, curr){
        var appidsSoFar = total.map(function(elem){ return elem.appid;  });
        var index = appidsSoFar.indexOf(curr.appid);
        if(index === -1){
          curr.count = [].concat(curr.count);
          curr.updated = [].concat(curr.updated);
          total.push(curr);
        }
        else{
          total[index].updated.push(curr.updated);
          total[index].count.push(curr.count);
        }
        return total;
      }, []);

      formatted = formatted.sort(function(a,b){
        if(a.count[a.count.length-1] < b.count[b.count.length-1]){
          return 1;
        }
        if(a.count[a.count.length-1] > b.count[b.count.length-1]){
          return -1;
        }
        return 0;
      });
      
      return cb(null, formatted);
    })
    .catch(function(err){
      console.error("There was a problem accessing the database: ", err);
      return cb(err);
    });
};

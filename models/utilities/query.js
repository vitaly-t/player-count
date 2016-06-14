var db = require('../../config/db');

var queries = (function setupDBQueries(){
  
  function select(what, from, where, limit, order, cb){
    if(!cb){
      throw new Error("Must provide a callback");
    }
    if(!what || !from){
      return cb(new Error("Field and Table parameters must be provided."));
    }
    var where = where ? " WHERE " + where : "";
    var order = order ? " ORDER BY " + order.field + " " + order.dir : "";
    var limit = limit ? " LIMIT " + limit : "";

    var query = "SELECT " + what + " FROM " + from + where + order + limit;

    db.any(query)
      .then(function(data){
        return cb(null, data);
      })
      .catch(function(err){
        return cb(err);
      });
  }

  return {
    select: select
  };

})();

module.exports = queries;

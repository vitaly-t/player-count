var knex = require('./knex');

// Access 'games_test' table.
function Games(){
  return knex('games_test');
}

// *** queries *** //

function getAll(){
  return Games().select();
}

function getOne(appid){
  return Games().where('appid',parseInt(appid)).first();
}

module.exports = {
  getAll: getAll,
  getOne: getOne
};



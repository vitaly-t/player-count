
exports.seed = function(knex, Promise) {
  return knex('games_test').del()
  .then(function(){
    return knex('games_test').insert({
      appid: 1,
      name: 'Game 1'
    });
  })
  .then(function(){
    return knex('games_test').insert({
      appid: 2,
      name: 'Game 2'
    });
  });

};

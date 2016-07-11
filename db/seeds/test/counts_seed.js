
exports.seed = function(knex, Promise) {
   return knex('counts_test').del()
  .then(function(){
    return knex('counts_test').insert({
      appid: 1,
      count: 100
    });
  })
  .then(function(){
    return knex('counts_test').insert({
      appid: 2,
      count: 200
    });
  });
};

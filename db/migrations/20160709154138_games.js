
exports.up = function(knex, Promise) {
  return knex.schema.createTable('games_test',function(table){
    table.increments();
    table.integer('appid').notNullable().unique();
    table.string('name').notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('games_test');
};

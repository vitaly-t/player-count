
exports.up = function(knex, Promise) {
  return knex.schema.createTable('total_players_test',function(table){
    table.increments();
    table.integer('count').notNullable().defaultTo(0);
    table.timestamp('added').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('total_players_test');
};


exports.up = function(knex, Promise) {
  return knex.schema.createTable('counts_test',function(table){
    table.increments();
    table.integer('appid').notNullable();
    table.integer('count').notNullable().defaultTo(0);
    table.timestamp('updated').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('counts_test');
};

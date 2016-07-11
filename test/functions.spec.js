process.env.NODE_ENV = 'test';

var chai = require('chai');
chai.config.includeStack = true;
var should = chai.should();
var knex = require('../db/knex');

describe('API Routes',function(){

  beforeEach(function(done){
    knex.migrate.rollback()
    .then(function(){
      knex.migrate.latest()
      .then(function(){
        return knex.seed.run()
        .then(function(){
          done();
        });
      });
    });
  });

  afterEach(function(done){
    knex.migrate.rollback()
    .then(function(){
      done();
    });
  });



});

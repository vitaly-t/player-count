process.env.NODE_ENV = 'test';

var chai = require('chai');
chai.config.includeStack = true;
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../app');
var knex = require('../db/knex');

chai.use(chaiHttp);

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

  describe('GET /test/select',function(){
    it('Should get all records from "games" table.',function(done){
      chai.request(server)
      .get('/test/select')
      .end(function(err,res){
        res.should.have.status(200);
        res.should.be.json; // jshint ignore:line
        res.body.should.be.a('array');
        res.body.length.should.equal(2);
        res.body[0].should.have.property('appid');
        res.body[0].appid.should.equal(1);
        res.body[0].should.have.property('name');
        res.body[0].name.should.equal('Game 1');
        done();
      }); 
    });
  });

  describe('GET /test/select/:appid',function(){
    it('Should get the record specified by the appid.',function(done){
      chai.request(server)
      .get('/test/select/1')
      .end(function(err,res){
        res.should.have.status(200);
        res.should.be.json; //jshint ignore:line
        res.body.should.be.a('object');
        res.body.should.have.property('appid');
        res.body.appid.should.equal(1);
        res.body.should.have.property('name');
        res.body.name.should.equal('Game 1');
        done();
      });
    });
  });
});

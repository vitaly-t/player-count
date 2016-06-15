require('rootpath')();
var getCurrentPlayerCounts = require('models/utilities/get/get-curr-player-counts');
var getHighPopGames = require('models/utilities/get/get-high-pop-games');
var updatePlayerCounts = require('models/utilities/update/update-player-counts');

describe("Testing the updatePlayerCounts function.", function(){
  var highPopGames;
  var currentPlayerCounts;
  var originalTimeout;

  beforeAll(function(done){
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    getHighPopGames(function(err,games){
      var highPopGames = games;
      getCurrentPlayerCounts(highPopGames, function(err,counts){
        currentPlayerCounts = counts;
        done();
      });
    });
  });

  it("Should call the callback with an error if an array of games is not provided.", function(done){
    console.log(highPopGames, currentPlayerCounts);
    updatePlayerCounts("", function(err, data){
      expect(err).not.toBe(null);
      expect(data).toBe(undefined);
      done();
    });
  });

  it("Should work", function(done){
    console.error(currentPlayerCounts);
    updatePlayerCounts(currentPlayerCounts, function(err, data){
      console.error(data);
      expect(err).toBe(null);
      done();
    });
  });
  afterAll(function(){
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});

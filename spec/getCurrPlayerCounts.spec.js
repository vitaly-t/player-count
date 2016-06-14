describe("Testing function to retrieve current player counts for games given by array of appids.", function(){
  var getCurrPlayerCounts = require('../models/utilities/get-curr-player-counts');
  var getHighPopGames = require('../models/utilities/get-high-pop-games');
  var originalTimeout;
  var highPopGames;
  
  beforeAll(function(done){
    getHighPopGames(function(err, games){
      highPopGames = games;
      done();
    });
  });

  beforeEach(function(){
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  });

  it("Should gracefully errors returned by the request.", function(){
    
  });

  it("Should not open more requests than are allowed by the OS.", function(){
    
  });

  it("Should return an array of objects each containing the game's appid and current player count.", function(done){
    getCurrPlayerCounts(highPopGames, function(err, data){
      console.error(data);
      expect(err).toBe(null);
      expect(Array.isArray(data)).toBe(true);
      done();
    });
  });

  afterEach(function(){
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});

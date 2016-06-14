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
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000;
  });

  it("Should gracefully errors returned by the request.", function(done){
    // NOTE: Given that this test depends on errors being return by the API, it
    // requires editing the URL in the function's file to be intentionally
    // incorrect.
    //getCurrPlayerCounts(highPopGames, function(err, data){
    //  expect(err).not.toBe(null);
    //  expect(data).toBe(undefined);
    //  done();
    //});
    //
    // NOTE: Any 'stand-in' function that is asynchronous MUST call done() at
    // some point.
    done();
    
  });

// NOTE: Since implementing 'async.map', I have not had a problem issuing too
// many requests.
//  it("Should not open more requests than are allowed by the OS.", function(){
//    
//  });

  it("Should return an array of objects each containing the game's appid and current player count.", function(done){
    getCurrPlayerCounts(highPopGames, function(err, data){
      expect(err).toBe(null);
      expect(Array.isArray(data)).toBe(true);
      expect(data[0].response.player_count).not.toBe(undefined);
      expect(data[0].appid).not.toBe(undefined);
      done();
    });
  });

  afterEach(function(){
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});

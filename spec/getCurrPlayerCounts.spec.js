// Use 'rootpath' module so subsequent requires are made relative to root path.
require('rootpath')();
var getCurrPlayerCounts = require('models/utilities/get/get-curr-player-counts');
var getHighPopGames = require('models/utilities/get/get-high-pop-games');

describe("Testing function to retrieve current player counts for games given by array of appids.", function(){
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
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;
  });

  it("Should execute callback with an error if an array is not passed as a parameter.", function(done){
    getCurrPlayerCounts("3", function(err, data){
      expect(err).not.toBe(null);
      expect(data).toBe(undefined);
      done();
    });
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

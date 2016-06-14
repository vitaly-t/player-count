describe("Testing function to retrieve current player counts for games given by array of appids.", function(){
  var getCurrPlayerCounts = require('../models/utilities/get-curr-player-counts');
  var getHighPopGames = require('../models/utilities/get-high-pop-games');

  it("Should gracefully errors returned by the request.", function(){
    
  });

  it("Should not open more requests than are allowed by the OS.", function(){
    
  });

  it("Should return an array of objects each containing the game's appid and current player count.", function(done){
    getHighPopGames(function(err, games){
      getCurrPlayerCounts(games, function(err, data){
        console.log(data);
        expect(err).toBe(null);
        expect(Array.isArray(data)).toBe(true);
        done();
      });
    });
  });
});

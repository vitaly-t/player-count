require('rootpath')();
var getCurrentPlayerCounts = require('models/utilities/get/get-curr-player-counts');
var getHighPopGames = require('models/utilities/get/get-high-pop-games');
var updatePlayerCounts = require('models/utilities/update/update-player-counts');

describe("Testing the updatePlayerCounts function.", function(){
  var highPopGames;
  var currentPlayerCounts;
  beforeAll(function(done){
    getHighPopGames(function(err,games){
      var highPopGames = games;
      getCurrentPlayerCounts(highPopGames, function(err,counts){
        currentPlayerCounts = counts;
        done();
      });
    });
  });
  it("Should work", function(done){
    console.log(currentPlayerCounts);
    updatePlayerCounts(currentPlayerCounts, function(err, data){
      console.error(data);
      expect(err).toBe(null);
      done();
    });
  });
});

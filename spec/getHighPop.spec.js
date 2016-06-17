// Use 'rootpath' module so subsequent requires are made relative to root path.
require('rootpath')();
var getCurrPlayerCounts = require('models/utilities/get/get-curr-player-counts');
var getHighPopGames = require('models/utilities/get/get-high-pop-games');

describe("Testing function to retrieve games with population greater than minimum.", function(){
  it("Should throw an error if no callback is provided.", function(){
    expect(function(){  getHighPopGames(); }).toThrow();
  });

  it("Should return an array of records.", function(done){
    getHighPopGames(function(err, data){
      console.log(data);
      expect(err).toBe(null);
      expect(Array.isArray(data)).toBe(true);
      done();
    });
  });
});

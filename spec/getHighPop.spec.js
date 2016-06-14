var db = require('../config/db');
var getHighPop = require('../models/utilities/get-high-pop-games');

describe("Testing function to retrieve games with population greater than minimum.", function(){
  it("Should throw an error if no callback is provided.", function(){
    expect(function(){  getHighPop(); }).toThrow();
  });

  it("Should return an array of records.", function(done){
    getHighPop(function(err, data){
      expect(err).toBe(null);
      expect(Array.isArray(data)).toBe(true);
      done();
    });
  });
});

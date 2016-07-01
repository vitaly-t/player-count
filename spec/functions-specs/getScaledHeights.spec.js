require('rootpath')();
var getScaledHeights = require('functions/get-scaled-heights');

describe("Testing getScaledHeights function.",function(){
  var normalYs,zeroYs,height;
  beforeAll(function(){
    normalYs = [1,2,3];
    zeroYs = [0,0,0,0];
    height = 2;
  });
  
  it("Should throw an exception if either paramter is missing.",function(){
    expect(function(){getScaledHeights(null,height)}).toThrow();
    expect(function(){getScaledHeights(normalYs,null)}).toThrow();
  });

  it("Should throw an exception if yValues isn't an array or height isn't a number.",function(){
    expect(function(){getScaledHeights('4',height)}).toThrow();
    expect(function(){getScaledHeights(normalYs,'a')}).toThrow();
  });

  it("Should only accept positive yValues.",function(){

  });

  it("If the max element is 0, it should return the original array.", function(){
    expect(getScaledHeights(zeroYs,height)).toEqual(zeroYs);
  });

});

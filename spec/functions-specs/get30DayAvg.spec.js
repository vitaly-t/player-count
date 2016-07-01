require('rootpath')();
var get30DayAvg = require("functions/get-30-day-avg");

describe("Testing function to get average player count for last month.", function() {

  var zeroArr = [],
    shortArr = [],
    medArr = [],
    longArr = [];
  beforeAll(function() {
    for (var i = 0; i < 50; i++) {
      if (i < 10) {
        shortArr.push(1);
      }
      if (i < 30) {
        medArr.push(1);
      }
      longArr.push(1);
    }
  });

  it("Should throw an error if passed a non-array.",function(){
    expect(function(){get30DayAvg('4')}).toThrow();
  });

  it("Should throw an error if param array contains a non-number.", function() {
    var mixedArr = medArr.concat(['a']);
    expect(function(){get30DayAvg(mixedArr)}).toThrow();
  });

  it("Should work if length of param array is 30.", function() {
    expect(get30DayAvg(medArr)).toEqual(1);
  });

  it("Should work if length of param array is less than 30.", function() {
    expect(get30DayAvg(shortArr)).toEqual(1);
  });

  it("Should work if length of param array is greater than 30.", function() {
    expect(get30DayAvg(longArr)).toEqual(1);
  });

  it("Should return null if length of param array is 0.", function() {
    expect(get30DayAvg(zeroArr)).toBe(null);
  });


});

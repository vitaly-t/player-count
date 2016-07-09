require('rootpath')();
var prettifyNumber = require('functions/prettify-number');

describe('Testing prettifyNumbers function.',function(){
  it('When passed a non-number value, it should return the value unchanged.',function(){
    expect(prettifyNumber('a')).toEqual('a');
    expect(prettifyNumber('123a')).toEqual('123a');
    expect(prettifyNumber('123')).toEqual('123');
  });
  it('Should correctly handle numbers with decimals.',function(){
    expect(prettifyNumber(2234123.123456)).toEqual('2,234,123.123456');
  });
  it('Should correctly handle negative numbers.',function(){
    expect(prettifyNumber(-132234123.123456)).toEqual('-132,234,123.123456');
    expect(prettifyNumber(-12234123.123456)).toEqual('-12,234,123.123456');
    expect(prettifyNumber(-1234123.123456)).toEqual('-1,234,123.123456');
  });
});

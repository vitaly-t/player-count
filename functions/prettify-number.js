function prettifyNumber(number){
  if(isNaN(number)) return number;
  var sNum = number + "";
  var aNum = sNum.split("");
  var count = 1;
  // Check for decimal. We substract 1 from aNum.indexOf('.') so that we start
  // at the first digit before the decimal.
  var start = (aNum.indexOf('.') !== -1) ? aNum.indexOf('.')-1 : aNum.length-1;
  for(var i = start; i >= 0; i--){
    if(count % 3 === 0 && i !== 0){
      aNum[i] = "," + aNum[i];
    }
    count++;
  }
  return aNum.join("");
}

module.exports = prettifyNumber;

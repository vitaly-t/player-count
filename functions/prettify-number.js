function prettifyNumber(number){
  var sNum = number + "";
  var aNum = sNum.split("");
  var count = 1;
  for(var i = aNum.length-1; i >= 0; i--){
    if(count % 3 === 0 && i !== 0){
      aNum[i] = "," + aNum[i];
    }
    count++;
  }
  return aNum.join("");
}

module.exports = prettifyNumber;

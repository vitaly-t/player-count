function get30DayAvg(arr) {
  var length = arr.length;
  if(length >= 30){
    arr = arr.slice(arr.length-31);
    length = 30;
  }
  return (arr.reduce(function(total, elem) {
    return total + elem;
  }, 0) / length).toFixed(0);
}

module.exports = get30DayAvg;

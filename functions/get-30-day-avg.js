function get30DayAvg(arr) {
  if(!Array.isArray(arr)) throw new TypeError("get30DayAvg requires that you must pass an array.");

  var length = arr.length;
  if(length === 0) return null;

  if(length > 30){
    arr = arr.slice(-30);
    length = 30;
  }

  var avg = Math.floor((arr.reduce(function(total, elem) {
    return total + elem;
  }, 0) / length));

  if(isNaN(avg)) throw new TypeError('get30DayAvg requires an array of numbers');

  return avg;
}

module.exports = get30DayAvg;

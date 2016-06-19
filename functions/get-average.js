function getAvg(arr) {
  return (arr.reduce(function(total, elem) {
    return total + elem;
  }, 0)) / arr.length;
}

module.exports = getAvg;

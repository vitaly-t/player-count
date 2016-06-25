var getScaledHeights = require('./get-scaled-heights');

function getPolylinePoints(yValues,width,height){
  var heights = getScaledHeights(yValues,height);
  var points = heights.reduce(function(total,y,index){
    var x = Math.floor(width / 7) * index;
    y = height - y;
    var point = x + "," + y + " ";
    return total + point;
  },"").trim();
  return points;
}

module.exports = getPolylinePoints;

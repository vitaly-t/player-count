function getScaledHeights(yValues, height){
  var max = Math.max.apply(null,yValues);
  var heights = [];
  yValues.forEach(function(yValue,index){
    heights.push( Math.floor((yValue / max) * height));
  });
  return heights;
}

module.exports = getScaledHeights;

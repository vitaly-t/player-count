function getScaledHeights(yValues, height){
  if(!yValues || !height){
    throw new Error("Must include both 'yValues' and 'height' parameters.");
  }
  else if(!Array.isArray(yValues) || !Number.isInteger(height)){
    throw new TypeError("'yValues' must be an array, height an integer.");
  }
  var max = Math.max.apply(null,yValues);
  if(max === 0) return yValues;

  var heights = [];
  yValues.forEach(function(yValue,index){
    heights.push( Math.floor((yValue / max) * height));
  });
  return heights;
}

module.exports = getScaledHeights;

var interpPoly = (function(){
  function getDivDiffs(points){
    var divDiffs = [];
    for(var i = 0; i < points.length; i++){
      divDiffs.push(points[i].y);
    }
    for(var j = 1; j < points.length; j++){
      for(var k = points.length-1; k >= j; k--){
        divDiffs[k] = (divDiffs[k] - divDiffs[k-1]) / (points[k].x - points[k-j].x);
      }
    }
    return divDiffs;
  }

  function getProduct(x, points, stop){
    var product = 1;
    for(var i = 0; i < stop; i++){
      product *= x - points[i].x;
    }
    return product;
  }

  function getNewtonPoly(points){
    var divDiffs = getDivDiffs(points);
    return function(x){
      var sum = 0;
      for(var i = 0; i < points.length; i++){
        sum += divDiffs[i] * getProduct(x, points, i);
      }
      return sum;
    };
  }

  function getBounds(arr){
    var max = Math.max.apply(null, arr.map(function(point){ return point.x;  }));
    var min = Math.min.apply(null, arr.map(function(point){ return point.x;  }));
    return {
      max:max,
      min:min
    };
  }

  return {
    generatePoly: getNewtonPoly,
    getBounds: getBounds
  };

})();

module.exports = interpPoly;

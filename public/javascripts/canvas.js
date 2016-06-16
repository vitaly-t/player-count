(function canvasSetup(){
  
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
  
  var points = [{x:20,y:40}, {x:60,y:20}, {x:100,y:120}, {x:160,y:10}];

  var c = document.getElementById("my-canvas");
  var ctx = c.getContext("2d");
  var poly = getNewtonPoly(points);
  var bounds = getBounds(points);

  ctx.beginPath();
  ctx.moveTo(points[0].x,points[0].y);
  for(var i = bounds.min; i < bounds.max; i+= 0.1 ){
    ctx.lineTo(i,poly(i)); 
  }
  ctx.stroke();
})();

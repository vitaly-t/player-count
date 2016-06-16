(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function canvasSetup(){
  var interpPoly = require('./interp-poly.js');
  
  var points = [{x:20,y:40}, {x:60,y:20}, {x:100,y:120}, {x:160,y:10}];

  var c = document.getElementById("my-canvas");
  var ctx = c.getContext("2d");
  var poly = interpPoly.generatePoly(points);
  var bounds = interpPoly.getBounds(points);

  ctx.beginPath();
  ctx.moveTo(points[0].x,points[0].y);
  for(var i = bounds.min; i < bounds.max; i+= 0.1 ){
    ctx.lineTo(i,poly(i)); 
  }
  ctx.stroke();
})();

},{"./interp-poly.js":2}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
(function() {

  require('./interp-poly.js');
  require('./canvas.js');
  console.log('test2');

})();

},{"./canvas.js":1,"./interp-poly.js":2}]},{},[3]);

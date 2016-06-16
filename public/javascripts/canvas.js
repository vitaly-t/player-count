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

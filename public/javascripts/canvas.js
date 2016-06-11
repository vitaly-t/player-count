(function canvasSetup(){
  var c = document.getElementById("my-canvas");
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(20,20);
  ctx.quadraticCurveTo(20,100,200,20);
  ctx.stroke();
})();

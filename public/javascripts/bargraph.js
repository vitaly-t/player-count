(function(){

  var canvas = document.getElementById('my-canvas');
  canvas.width = 800;
  canvas.height = 200;

  var ctx = canvas.getContext('2d');
  var yValues = [25,80,48,38,69,100];
  ctx.beginPath();
  var pos = {x:0,y: 200};
  yValues.forEach(function(y){
    ctx.rect(pos.x,pos.y-y,20,y);
    pos.x += 20;
  });
  ctx.stroke();
  console.log('tst');

})();

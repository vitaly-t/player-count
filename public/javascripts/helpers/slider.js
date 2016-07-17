(function sliderSetup(){
  var margins = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };
  var width = 500 - margins.left - margins.right;
  var height = 100 - margins.top - margins.bottom;
  var vMiddle = Math.floor(height/2);
  var radius = 8;
  var colors = {
    circle: '#f96900',
    line: '#dce2c8',
    fill: '#65def1'
  };

  var svg = d3.select('body')
    .append('center')
    .append('svg')
    .attr('width',width)
    .attr('height',height)
    .append('g');
  var overlay = 
    svg.append('rect')
    .attr('width',width)
    .attr('height',height)
    .attr('fill','none')
    .attr('pointer-events','all')
    .on('touchmove',function(){
      var touchX = d3.touches(this)[0][0];
      if(touchX >= radius && touchX <= width - radius){
        sliderCircle
          .attr('transform','translate('+(touchX-radius)+',0)');
        sliderFill
          .attr('x2',touchX);
        console.log(Math.floor(touchX / (width - 2 * radius) * 100));
      }
    },true);
  var sliderLine = 
    svg.append('line')
    .attr('pointer-events','none')
    .attr('x1', radius)
    .attr('y1', vMiddle)
    .attr('x2', width - radius)
    .attr('y2', vMiddle)
    .attr('stroke', colors.line)
    .attr('stroke-width', '2');
  var sliderFill = 
    svg.append('line')
    .attr('pointer-events','none')
    .attr('x1', radius)
    .attr('y1', vMiddle)
    .attr('x2', radius)
    .attr('y2', vMiddle)
    .attr('stroke', colors.fill)
    .attr('stroke-width','2');
  var sliderCircle = 
    svg.append('circle')
    .attr('pointer-events','none')
    .attr('cx',radius)
    .attr('cy',vMiddle)
    .attr('r',radius)
    .attr('fill',colors.circle);

})();

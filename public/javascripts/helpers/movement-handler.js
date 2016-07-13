function movementHandler(width,height,POSITION_TEXTBOX_NEAR_CURSOR,guideline,textBox,pathAttrs,circles,getPosition,x) {
  console.log(this);
  console.log(d3.mouse(this),d3.touches(this));
  var event = d3.mouse(this).length !== 0 ? d3.mouse(this) : d3.touches(this);
  var mouseX = event[0];
  var mouseY = event[1];
  var rotate = mouseX + 80 >= width ? true : false;
  var pos;
  var transformation;
  guideline
    .attr("x1", mouseX)
    .attr("x2", mouseX)
    .attr("y2", height);
  textBox
    .selectAll('text')
    .selectAll('tspan')
    .filter(function(d, i) {
      return i === 0; // First tspan displays time.
    })
    .text(new Date(x.invert(mouseX)).toDateString());
  pathAttrs.forEach(function(pathAttr, index) {
    getPosition(mouseX, pathAttr, function(data) {
      circles[index]
        .attr("cx", data.x)
        .attr("cy", data.y);
      transformation = "translate(" + data.x + "," + (POSITION_TEXTBOX_NEAR_CURSOR ? mouseY : data.y) + ")";
      textBox
        .attr("opacity", "1")
        .attr("transform", transformation)
        .selectAll('text')
        .selectAll('tspan')
        .filter(function(d, i) {
          return i - 1 === index; // Every tspan after first displays a player count.
        })
        .attr('fill', LINE_COLORS[index])
        .text(prettifyNumber(data.actualY));
      if (rotate) {
        rotated = true;
        textBox.selectAll('path').attr('transform', 'scale(-1,1)');
        textBox.selectAll('text').attr('transform', 'translate(-94,0)');
      }
      // If !rotate and was previously rotated, RESET previous
      // transformations.
      else if (rotated) {
        textBox.selectAll('path').attr('transform', 'scale(1,1)');
        textBox.selectAll('text').attr('transform', 'translate(0,0)');
        rotated = false;
      }
    });
  });
}

module.exports = movementHandler;

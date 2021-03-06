var dates = [];
var lineData = playerCounts.count.map(function(count, index) {
  var date = new Date(playerCounts.updated[index]);
  // NOTE: HOURS MUST BE SET TO PROPERLY ALIGN POINTS ON GRAPH IN D3 WITH
  // RESPECT TO DAYS ALONG X AXIS
  date.setHours(0,0,0,0);
  if (dates.indexOf(date.getDate()) == -1) {
    dates.push(date.getDate());
    return {
      x: date,
      y: count
    };
  }
});
lineData = lineData.filter(function(point) {
  return point !== undefined;
});

var margin = {
    top: 20,
    right: 20,
    bottom: 70,
    left: 80
  },
  width = 550 - margin.left - margin.right,
  height = 250 - margin.top - margin.bottom;

var formatDate = d3.time.format("%d %b");

var x = d3.time.scale()
//  .domain([lineData[0].date, lineData[lineData.length - 1].date])
  .nice(d3.time.day, 1)
  .range([0, width]);

var formatYAxis = d3.format('.0f');

var y = d3.scale.linear()
  .range([height, 0]);

var xAxis = d3.svg.axis()
  .scale(x)
  .tickFormat(formatDate)
  .ticks(6)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .tickFormat(formatYAxis);

var lineFunction = d3.svg.line()
  .x(function(d) {
    return x(d.x);
  })
  .y(function(d) {
    return y(d.y);
  })
  .interpolate("cardinal");

//var area = d3.svg.area()
//    .interpolate("monotone")
//    .x(function(d) { return x(d.x); })
//    .y0(height)
//    .y1(function(d) { return y(d.y); });

var svg = d3.select("div#game-plot")
  .append("div")
  .classed("svg-container", true)
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
  .classed("svg-content-responsive", true)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(d3.extent(lineData, function(d) {
  return d.x;
})).nice(d3.time.day);
y.domain(d3.extent(lineData, function(d) {
  return d.y;
}));

svg.append("rect")
  .attr('width', width) // the whole width of g/svg
  .attr('height', height) // the whole heigh of g/svg
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on("mousemove", function() {
    var x = d3.mouse(this)[0];
    var pos;
    for (i = x; i < pathLength; i += accuracy) {
      pos = pathEl.getPointAtLength(i);
      if (pos.x >= x) {
        break;
      }
    }
    var actualY = Math.floor(y.invert(pos.y));
    circle
      .attr("cx", x)
      .attr("cy", pos.y);
    guideline
      .attr("x1", x)
      .attr("x2", x)
      .attr("y2", BBox.height);
    //textbox
      //.attr("transform","translate("+x+","+Math.floor(pos.y-textBBox.height/2)+")");
    text
      .attr("opacity","1")
      // Don't need to center without textbox.
      //.attr("transform","translate("+x+","+Math.floor(pos.y+textBBox.height/2)+")")
      .attr("transform","translate("+x+","+pos.y+")")
      .text(actualY);
  });

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);
//.selectAll("text")
//.attr("transform","rotate(-45)");

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left + 5)
  .attr("x", 0 - (height / 2))
  .attr("dy", ".71em")
  .style("text-anchor", "middle")
  .text("Players");
//svg.append("path")
//      .attr("class", "area")
//      .attr("d", area(lineData))
//      .attr("transform","translate(-35,0)");
var path = svg.append("path")
  .attr("class", "line")
  .attr("d", lineFunction(lineData))
  .attr("transform", "translate(0,0)");
console.log('Line Data',lineData);
var circle =
  svg.append("circle")
  .attr("cx", 100)
  .attr("cy", 350)
  .attr("r", 3)
  .attr("fill", "red");

var guideline =
  svg.append("line")
  .attr("class", "line")
  .attr("x1", 0)
  .attr("y1", 0)
  .attr("x2", 0)
  .attr("y2", 0);

var text =
  svg.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("opacity",0)
  .attr("font-size", "10")
  .attr("fill","white")
  .text('1000000');

var textEl = text.node();
var textBBox = textEl.getBBox();
console.log(textEl, textBBox);

//var textbox =
//  svg.append("rect")
//  .attr("width", textBBox.width)
//  .attr("height", textBBox.height)
//  .attr("fill", "white");

var pathEl = path.node();
var pathLength = pathEl.getTotalLength();
var BBox = pathEl.getBBox();
var scale = pathLength / BBox.width;
var offsetLeft = document.getElementById("game-plot").offsetLeft;
var pathBox = pathEl.getBoundingClientRect();
var accuracy = 5;

var dates = [];
var lineData = playerCounts.count.map(function(count,index){
  var date = new Date(playerCounts.updated[index]);
  if(dates.indexOf(date.getDay()) == -1){
    dates.push(date.getDay());
    return {x: date, y: count};
  }
});
lineData = lineData.filter(function(point){ return point !== undefined; });

var margin = {top: 20, right: 20, bottom: 70, left: 70},
    //width = 960 - margin.left - margin.right,
    //height = 500 - margin.top - margin.bottom;
    width = 550 - margin.left - margin.right,
    height= 250 - margin.top - margin.bottom;

var formatDate = d3.time.format("%d %b");

var x = d3.time.scale()
    //.domain([new Date(playerCounts.updated[0]), new Date(playerCounts.updated[playerCounts.updated.length-1])])
    .domain([lineData[0].date,lineData[lineData.length-1].date])
    .nice(d3.time.day,1)
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
	.x(function(d) { return x(d.x); })
	.y(function(d) { return y(d.y); })
	.interpolate("monotone");

var area = d3.svg.area()
    .interpolate("monotone")
    .x(function(d) { return x(d.x); })
    .y0(height)
    .y1(function(d) { return y(d.y); });

var svg = d3.select("div#game-plot")
  .append("div")
  .classed("svg-container",true)
  .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
    .classed("svg-content-responsive",true)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

x.domain(d3.extent(lineData, function(d) { return d.x; })).nice(d3.time.day);
y.domain(d3.extent(lineData, function(d) { return d.y; }));

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
		.attr("y", 0-margin.left+5)
    .attr("x",0-(height/2))
		.attr("dy", ".71em")
		.style("text-anchor", "middle")
		.text("Players");
svg.append("path")
      .attr("class", "area")
      .attr("d", area(lineData))
      .attr("transform","translate(-35,0)");
svg.append("path")
		.attr("class", "line")
		.attr("d", lineFunction(lineData))
    .attr("transform","translate(-35,0)");

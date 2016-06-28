var margin = {top: 20, right: 20, bottom: 30, left: 50},
    //width = 960 - margin.left - margin.right,
    //height = 500 - margin.top - margin.bottom;
    width = 650 - margin.left - margin.right,
    height= 250 - margin.top - margin.bottom;

//var formatDate = d3.time.format("%d-%b-%y");

var x = d3.time.scale()
    .range([0, width]);

var formatXAxis = d3.format('.0f');
var formatYAxis = d3.format('.0f');

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
		.tickFormat(formatXAxis);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
		.tickFormat(formatYAxis);

var lineFunction = d3.svg.line()
	.x(function(d) { return x(d.x); })
	.y(function(d) { return y(d.y); })
	.interpolate("basis");

var svg = d3.select("div#game-plot")
  .append("div")
  .classed("svg-container",true)
  .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
    .classed("svg-content-responsive",true)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var lineData = [ 
	{ "x": 1,   "y": 5},  { "x": 20,  "y": 20},
	{ "x": 40,  "y": 10}, { "x": 60,  "y": 40},
	{ "x": 80,  "y": 5},  { "x": 100, "y": 60}
];

x.domain(d3.extent(lineData, function(d) { return d.x; }));
y.domain(d3.extent(lineData, function(d) { return d.y; }));

svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
	.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Players");

svg.append("path")
		//.datum(data)
		.attr("class", "line")
		.attr("d", lineFunction(lineData));

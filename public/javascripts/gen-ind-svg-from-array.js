(function genIndSVGFromArray(){
  // CONSTANTS / Magic values
  var LINE_COLORS = [
    '#8BC53F',
    '#0099ff',
    '#ffff00',
    '#ff6600'
  ];
  var NUM_COUNTS = playerCounts.length;
  var ACCURACY = 5;
  var OFFSET_LEFT = document.getElementById("game-plot").offsetLeft;

  var dates = [];
  var lineData = [];
  for(var i = 0; i < NUM_COUNTS; i++){
    dates[i] = [];
    lineData[i] = [];
  }

  // Get formatted data for constructing each curve in D3
  playerCounts.forEach(function(playerCount,lIndex){
    lineData[lIndex] = playerCount.count.map(function(count, cIndex) {
      var date = new Date(playerCount.updated[cIndex]);
      date.setHours(0,0,0,0); // Set Hours to properly align points with xaxis in D3
      if (dates[lIndex].indexOf(date.getDate()) == -1) {
        dates[lIndex].push(date.getDate());
        return {
          x: date,
          y: count
        };
      }
    });
    lineData[lIndex] = lineData[lIndex].filter(function(point) {
      return point !== undefined;
    });
  });

  // NUM_CURVES and NUM_COUNTS can be different, as latter filters out entries
  // added on same day.
  var NUM_CURVES = lineData.length;

  var margin = {
      top: 20,
      right: 20,
      bottom: 70,
      left: 80
    },
    width = 550 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  var formatDate = d3.time.format("%d %b");
  var formatYAxis = d3.format('.0f');

  // 'x' and 'y' are functions for scaling data along respective axes.
  var x = d3.time.scale()
    .domain(d3.extent(
      lineData.reduce(function(total,lineDatum){
        return total.concat(lineDatum.map(function(datum){
          return datum.x;
        }));
      },[])
    ))
    .nice(d3.time.day, 1)
    .range([0, width]);
  var y = d3.scale.linear()
    .domain(d3.extent(
      lineData.reduce(function(total,lineDatum){
        return total.concat(lineDatum.map(function(datum){
          return datum.y;
        }));
      },[])
    ))
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

  // Create 'environment' for SVG. Container divs ensure SVG is scalable.
  var svg = d3.select("div#game-plot")
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // We want mouse movement relative to the curves themselves (excluding axes).
  // Hence we include a transparent rectangular overlay on top of the curves and
  // assign an 'onmousemove' function to it.
  svg.append("rect")
    .attr('width', width) // the whole width of g/svg
    .attr('height', height) // the whole heigh of g/svg
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on("mousemove", function() {
      var x = d3.mouse(this)[0];
      var pos;
      guideline
        .attr("x1", x)
        .attr("x2", x)
        .attr("y2", height);
      pathAttrs.forEach(function(pathAttr,index){
        getPosition(x,pathAttr,function(data){
          circles[index]
            .attr("cx", data.x)
            .attr("cy", data.y);
          texts[index]
            .attr("opacity","1")
            .attr("transform","translate("+data.x+","+data.y+")")
            .text(data.actualY);
        });
      });
    });

  function getPosition(x,attrs,cb){
    var pos;
    for (i = x; i < attrs.pathLength; i += ACCURACY) {
      pos = attrs.pathEl.getPointAtLength(i);
      if (pos.x >= x) {
        break;
      }
    }
    var actualY = Math.floor(y.invert(pos.y));
    return cb({
      x:x,
      y:pos.y,
      actualY:actualY
    });
  }

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

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

  var paths = [];
  var circles = [];
  var pathAttrs = [];
  var texts = [];

  lineData.forEach(function(lineDatum,index){
    paths[index] = svg.append("path")
      .attr("class", "line")
      .attr("d", lineFunction(lineDatum))
      .attr("transform", "translate(0,0)")
      .attr("stroke",LINE_COLORS[index]);
    var pathEl = paths[index].node();
    var pathLength = pathEl.getTotalLength();
    var BBox = pathEl.getBBox();
    pathAttrs[index] = {
      pathEl: pathEl,
      pathLength: pathLength,
      BBox: BBox
    };
    circles[index] =
      svg.append("circle")
      .attr("cx", 100)
      .attr("cy", 350)
      .attr("r", 2)
      .attr("fill", LINE_COLORS[index]);
    texts[index] = 
      svg.append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr("opacity",0)
      .attr("font-size", "10")
      .attr("fill","white");
  });

  var guideline =
    svg.append("line")
    .attr("class", "line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", 0)
    .attr("stroke","grey");

})();

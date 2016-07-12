(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function prettifyNumber(number){
  if(isNaN(number)) return number;
  var sNum = number + "";
  var aNum = sNum.split("");
  var count = 1;
  // Check for decimal. We substract 1 from aNum.indexOf('.') so that we start
  // at the first digit before the decimal.
  var start = (aNum.indexOf('.') !== -1) ? aNum.indexOf('.')-1 : aNum.length-1;
  // Ignore '-' if present.
  var end = (aNum.indexOf('-') !== -1) ? 1 : 0;
  for(var i = start; i > end; i--){
    if(count % 3 === 0){
      aNum[i] = "," + aNum[i];
    }
    count++;
  }
  return aNum.join("");
}

module.exports = prettifyNumber;

},{}],2:[function(require,module,exports){
(function setupBargraphOnhover(){
  var bars = document.getElementsByClassName('bargraph-bar');
  var bargraphs = document.getElementsByClassName('bargraph');
  var gs = document.getElementsByClassName('g-bargraph');
  var rows = document.getElementsByClassName('top-game-row');
  var dailyPlayers = document.getElementById('daily-players');
  // Remember that the object returned by document.getElementsByClassName is
  // NOT an array. It is an HTML Collection, hence why we do the following:
  Array.prototype.forEach.call(bars, function(bar){
    bar.addEventListener('mouseover', barMouseOverHandler, false);
  });

  Array.prototype.forEach.call(bargraphs,function(bargraph){
    bargraph.addEventListener('mouseout', barMouseOutHandler, false);
  });

  function barMouseOverHandler(e){
    var appid = e.target.getAttribute('data-appid');
    var time = e.target.getAttribute('data-time');
    var ind = parseInt(e.target.getAttribute('data-ind'));

    Array.prototype.forEach.call(rows,function(row, index){
      var dailyDisplay = row.getElementsByClassName('daily-display')[0];
      var count = 0;
      Array.prototype.forEach.call(gs[index].children, function(bar, barIndex){
        if(barIndex === ind){
          var count = bar.getAttribute('data-count');
          var dailyDisplay = row.getElementsByClassName('daily-display')[0];
          dailyDisplay.innerHTML = prettifyNumber(count);
          bar.style.opacity = 1;
        }
        else{
          bar.style.opacity = 0.5;
        }
      });
    });
    time = new Date(time);
    time = time.toDateString();
    dailyPlayers.innerHTML = time;
  }

  function barMouseOutHandler(e){
    Array.prototype.forEach.call(rows,function(row,index){
      var display = row.getElementsByClassName('daily-display')[0];
      display.innerHTML = "";
      Array.prototype.forEach.call(gs[index].children, function(bar){
        bar.style.opacity = 1;
      });
    });
    dailyPlayers.innerHTML = "Daily Players";
  }
  // May want to just require this latter.
  function prettifyNumber(number){
    var sNum = number + "";
    var aNum = sNum.split("");
    var count = 1;
    for(var i = aNum.length-1; i >= 0; i--){
      if(count % 3 === 0 && i !== 0){
        aNum[i] = "," + aNum[i];
      }
      count++;
    }
    return aNum.join("");
  }

})();

},{}],3:[function(require,module,exports){
var prettifyNumber = require('../../../functions/prettify-number');
(function genIndSVGFromArray() {

  // *** INITIAL DATA FORMATTING *** //

  // totalPlayers is only included in the 'index' page.
  // playerCounts is included on every other page with a graph.
  if (typeof totalPlayers !== "undefined") {
    playerCounts = {
      count: totalPlayers.map(function(record) {
        return record.count;
      }),
      updated: totalPlayers.map(function(record) {
        return record.added;
      })
    };
  }
  // Ensure playerCounts is an array 
  playerCounts = Array.isArray(playerCounts) ? playerCounts : [playerCounts];
  if (playerCounts.length === 0) return;


  // *** CONSTANTS & MAGIC VALUES *** //

  var CONTAINER_ID = document.getElementById('total-players') ? 'total-players' : 'game-plot';
  var LINE_COLORS = [
    '#8BC53F',
    '#0099ff',
    '#ffff00',
    '#ff6600'
  ];
  var NUM_COUNTS = playerCounts.length;
  var ACCURACY = 5;
  var OFFSET_LEFT = document.getElementById(CONTAINER_ID).offsetLeft;
  var POSITION_TEXTBOX_NEAR_CURSOR = (playerCounts.length !== 1) ? true : false;
  var TEXTBOX_WIDTH = 86;
  var NUMBER_OF_TICKS = 6;
  var FONT_SIZE = 10;


  // *** FORMAT DATA FOR USE IN D3 *** //

  var dates = [];
  var lineData = [];
  for (var i = 0; i < NUM_COUNTS; i++) {
    dates[i] = [];
    lineData[i] = [];
  }

  // Get formatted data for constructing each curve in D3
  playerCounts.forEach(function(playerCount, lIndex) {
    lineData[lIndex] = playerCount.count.map(function(count, cIndex) {
      var date = new Date(playerCount.updated[cIndex]);
      date.setHours(0, 0, 0, 0); // Set Hours to properly align points with xaxis in D3
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


  // *** DESCRIBE SVG MEASUREMENTS *** //
  // 20,20,70,80
  var margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: (typeof totalPlayers === 'undefined') ? 20 : 10
    },
    width = 560 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  var TICK_SIZE_X = (typeof totalPlayers === 'undefined') ? 5 : 0;
  var TICK_SIZE_Y = (typeof totalPlayers === 'undefined') ? 5 : 0;

  // *** DEFINE AXES *** //

  var formatDate = d3.time.format("%d %b");
  var formatYAxis = function(d) {
    if ((d / 1000000) >= 1) {
      d = d / 1000000 + "M";
    } else if ((d / 1000) >= 1) {
      d = d / 1000 + "K";
    }
    return d;
  };

  // 'x' and 'y' are functions for scaling data along respective axes.
  var x = d3.time.scale()
    .domain(d3.extent(
      lineData.reduce(function(total, lineDatum) {
        return total.concat(lineDatum.map(function(datum) {
          return datum.x;
        }));
      }, [])
    ))
    .nice(d3.time.day, 1)
    .range([0, width]);
  var y = d3.scale.linear()
    .domain(d3.extent(
      lineData.reduce(function(total, lineDatum) {
        return total.concat(lineDatum.map(function(datum) {
          return datum.y;
        }));
      }, [])
    ))
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(formatDate)
    .ticks(NUMBER_OF_TICKS)
    .tickSize(TICK_SIZE_X,0,0)
    .orient("bottom");
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(formatYAxis)
    .tickSize(TICK_SIZE_Y,0,0)
    .ticks(NUMBER_OF_TICKS);

  // lineFunction describes how x,y values should be scaled according to axes.
  // Also describes how points should be interpolated.
  var lineFunction = d3.svg.line()
    .x(function(d) {
      return x(d.x);
    })
    .y(function(d) {
      return y(d.y);
    })
    .interpolate("cardinal");


  // *** DEFINE SVG AND PRIMARY CONTAINERS *** //

  // Create 'environment' for SVG. Container divs ensure SVG is scalable.
  var svg = d3.select("div#" + CONTAINER_ID)
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform", "translate(" + (margin.left + 25) + "," + (margin.top-10) + ")"); // So x axis isn't cut off.


  // *** DEFINE RECT OVERLAY FOR RESPONDING TO MOUSEMOVE EVENTS *** //

  // We want mouse movement relative to the curves themselves (excluding axes).
  // Hence we include a transparent rectangular overlay on top of the curves and
  // assign an 'onmousemove' function to it.
  var rotated = false;
  svg.append("rect")
    .attr('width', width) // the whole width of g/svg
    .attr('height', height) // the whole heigh of g/svg
    .attr('fill', 'none')
    .attr('pointer-events', 'all')
    .on("mousemove", function() {
      var mouseX = d3.mouse(this)[0];
      var mouseY = d3.mouse(this)[1];
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
    });

  function getPosition(x, attrs, cb) {
    var pos;
    for (i = x; i < attrs.pathLength; i += ACCURACY) {
      pos = attrs.pathEl.getPointAtLength(i);
      if (pos.x >= x) {
        break;
      }
    }
    var actualY = Math.floor(y.invert(pos.y));
    return cb({
      x: x,
      y: pos.y,
      actualY: actualY
    });
  }


  // *** APPEND AXES TO SVG ELEMENT *** //

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + (height + 3) + ")") // otherwise curves dip below marks.
    .call(xAxis);

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  if(typeof totalPlayers !== 'undefined'){
    var yAxisGrid = yAxis.ticks(NUMBER_OF_TICKS)
      .tickSize(width,0)
      .tickFormat("")
      .orient("right");

    var xAxisGrid = xAxis.ticks(NUMBER_OF_TICKS)
      .tickSize(-height,0)
      .tickFormat("")
      .orient("top");

    svg.append("g")
      .attr('class','grid')
      .call(yAxisGrid);

    svg.append("g")
      .attr('class','grid')
      .call(xAxisGrid);
  }

  // *** ESTABLISH PATHS AND RELATED ELEMENTS THAT WILL NEED TO BE DRAWN *** //

  var paths = [];
  var circles = [];
  var pathAttrs = [];

  lineData.forEach(function(lineDatum, index) {
    paths[index] = svg.append("path")
      .attr("class", "line")
      .attr("d", lineFunction(lineDatum))
      .attr("transform", "translate(0,0)")
      .attr("stroke", LINE_COLORS[index]);
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
  });
  

  // *** DEFINE GUIDELINE AND TEXTBOX ELEMENTS *** //

  var guideline =
    svg.append("line")
    .attr("class", "line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", 0)
    .attr("stroke", "grey");

  var textBox =
    svg.append('g')
    .attr('opacity', '0');
  var textHeight = (lineData.length + 1) * (FONT_SIZE + 2);
  var textY = Math.floor(textHeight / 2);
  // This path defines the border of the text box. It's shaped like a tag
  // (rectangle with isoceles triangle on its left) .
  textBox
    .append('path')
    .attr('d', 'M 0 0 L 5 ' + textY + ' L ' + (5 + TEXTBOX_WIDTH) + ' ' + textY + ' L ' + (5 + TEXTBOX_WIDTH) + ' ' + -textY + ' L 5 ' + -textY + ' L 0 0')
    .attr('pointer-events', 'none')
    .style('stroke', '#aaa')
    .style('fill', '#111');
  textBox
    .append('text')
    .attr('x', '5')
    .attr('y', -textY + FONT_SIZE)
    .attr('pointer-events', 'none')
    .attr("font-size", FONT_SIZE)
    .attr("fill", "white");
  // Add a tspan for each game being considered, plus one more to display date/time
  for (var j = 0; j < lineData.length + 1; j++) {
    textBox.selectAll('text')
      .append('tspan')
      .attr('x', '5')
      .attr('dy', j ? FONT_SIZE+2 : '0');
  }

  
  // *** DEFINE OVERLAY TO SIMULATE PLOT BEING ANIMATED *** //

  // Adds a curtain over the plot that shrinks towards the right.
  // By setting the 'x' and 'y' attributes and rotating the plot as we are, we
  // essentially flipping the curtain and hence the direction in which it
  // will shrink (left to right vs normal right to left)
  if (typeof totalPlayers === 'undefined') { // Don't add animation to total players plot.
    var curtain =
      svg.append('rect')
      .attr('x', -1 * width)
      .attr('y', -1 * height - 2)
      .attr('class', 'curtain')
      .attr('height', height + margin.top)
      .attr('width', width - 1) // Otherwise curtain slightly overlaps y axis.
      .attr('transform', 'rotate(180)')
      .style('fill', 'rgb(26,26,26)');

    var t =
      svg.transition()
      .delay(500)
      .duration(1000)
      .ease('linear');

    t.select('rect.curtain')
      .attr('width', 0);
  }


})();

},{"../../../functions/prettify-number":1}],4:[function(require,module,exports){
(function() {
  require('./helpers/bargraph-onhover');
  require('./helpers/gen-ind-svg-from-array');
})();

},{"./helpers/bargraph-onhover":2,"./helpers/gen-ind-svg-from-array":3}]},{},[4]);

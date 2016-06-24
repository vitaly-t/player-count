(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
      console.log(dailyDisplay);
      var count = 0;
      Array.prototype.forEach.call(gs[index].children, function(bar, barIndex){
        if(barIndex === ind){
          var count = bar.getAttribute('data-count');
          var dailyDisplay = row.getElementsByClassName('daily-display')[0];
          dailyDisplay.innerHTML = count;
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

})();

},{}],2:[function(require,module,exports){
var getWidth = require('./helpers/get-width');
var createSVGElem = require('./helpers/create-svg-elem');

(function createPlot() {
  var svg = document.getElementById('svg-totals-plot');
  var plot = svg.getElementById('g-plot');
  var bounds = svg.getBoundingClientRect();
  var X_INTERVAL = Math.floor(100 / 8);
  var Y_INTERVAL = Math.floor(100 / 8);
  var Y_INTERVAL_PIX = Y_INTERVAL / 100 * bounds.height;

  var points = "";
  // Point coordinates determined as percentage of width.
  for (var i = X_INTERVAL; i < 100; i += X_INTERVAL) {
    // There are 7 increments hence the max value of y is as below.
    var y = Math.floor(Math.random() * (7 * Y_INTERVAL_PIX));
    points += Math.floor(i / 100 * bounds.width) + "," + y + " ";
  }
  points = points.slice(0, points.length - 1);

  var polyline = createSVGElem("polyline", {
    points: points,
    style: "fill:none;stroke:white;stroke-width:1",
  });

  var pointsArray = polyline.getAttribute("points").split(" ");
  pointsArray = pointsArray.map(function(point) {
    return point.split(",");
  });

  // Create Vertical Plot lines.
  for (var i = X_INTERVAL; i < 100; i += X_INTERVAL) {
    var line = createSVGElem("line", {
      x1: i + "%",
      y1: 0 + "%",
      x2: i + "%",
      y2: 100 + "%",
      stroke: "#262626",
      "stroke-width": "1",
    });
    var text = createSVGElem("text", {
      x: (i - 5) + "%",
      y: 100 + "%",
      "font-size": 15,
      fill: "#7a7a7a"
    });
    text.appendChild(document.createTextNode("Day"));
    plot.appendChild(line);
    plot.appendChild(text);
  }

  // Create Horizontal Plot lines.
  var playerCount = 3;
  for (var i = Y_INTERVAL; i < 100; i += Y_INTERVAL) {
    if (playerCount >= 0) {
      var line = createSVGElem("line", {
        x1: 0 + "%",
        y1: i + "%",
        x2: 100 + "%",
        y2: i + "%",
        stroke: "#262626",
        "stroke-width": "1",
      });
      plot.appendChild(line);
      var text = createSVGElem("text", {
        "font-size": 15,
        fill: "#7a7a7a",
        x: 0,
        y: i + "%",
      });
      text.appendChild(document.createTextNode(playerCount + "M"));
      playerCount -= 0.5;
      plot.appendChild(text);
    }
  }

  plot.appendChild(polyline);
  // Use mouseleave instead of mouseout, as the latter triggers when mousing
  // over descendant elements.
  svg.addEventListener('mouseleave', hideOverlay, false);
  svg.addEventListener('mouseenter', showOverlay, false);
  svg.addEventListener('mousemove', moveOverlay, false);

  var overlay = createSVGElem("line", {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: bounds.height,
    stroke: "red",
    "stroke-width": "3",
    style: "opacity:0",
  });
  overlay.id = "overlay";
  plot.appendChild(overlay);

  function moveOverlay(e) {
    var overlay = document.getElementById('overlay');
    var overlayX = overlay.getAttribute("x");
    // NOTE: Add 10 to account for padding.
    var cursorX = Math.floor(e.clientX - (getWidth() - bounds.width) / 2) + 10;
    var xDiff = cursorX - overlayX;
    overlay.setAttribute("transform", 'translate(' + xDiff + ',0)');
    if (cursorX % Math.floor(X_INTERVAL / 100 * bounds.width) === 0) {
      document.getElementById('count-display').innerHTML = (3.5 * ((7 * Y_INTERVAL_PIX - pointsArray.filter(function(point) {
        return point[0] == cursorX;
      })[0][1]) / (7 * Y_INTERVAL_PIX))).toFixed(2) + "M Players";
    }
  }

  // Adds text next to each point showing corresponding y value. Too clunky to
  // use right now.
  //  for(var i = 0; i < pointsArray.length; i++){
  //    var text = document.createElementNS("http://www.w3.org/2000/svg","text");
  //    text.classList = "text";
  //    text.setAttribute("x",pointsArray[i][0]);
  //    text.setAttribute("y",bounds.height - pointsArray[i][1]);
  //    text.setAttribute('font-size',"10");
  //    text.setAttribute("fill","black");
  //    var says = document.createTextNode(bounds.height - pointsArray[i][1]);
  //    text.appendChild(says);
  //
  //    var textbox = document.createElementNS("http://www.w3.org/2000/svg","rect");
  //    textbox.classList = "textBox";
  //    textbox.setAttribute("fill","white");
  //    textbox.setAttribute("x", pointsArray[i][0]);
  //    textbox.setAttribute("y", bounds.height - pointsArray[i][1]-10);
  //    textbox.setAttribute("width", "15");
  //    textbox.setAttribute("height", 10);
  //
  //    var g = document.createElementNS("http://www.w3.org/2000/svg","g");
  //    g.appendChild(textbox);
  //    g.appendChild(text);
  //
  //    plot.appendChild(g);
  //    
  //  }

  function hideOverlay(e) {
    document.getElementById("overlay").style.opacity = 0;
    document.getElementById('count-display').innerHTML = "Hover over the plot to see player counts";
  }

  function showOverlay(e) {
    document.getElementById("overlay").style.opacity = 1;
  }

})();

},{"./helpers/create-svg-elem":3,"./helpers/get-width":4}],3:[function(require,module,exports){
function createSVGElem(type, attributes){
  try{
    var svg = document.createElementNS("http://www.w3.org/2000/svg",type);
    for(var attr in attributes){
      if(attributes.hasOwnProperty(attr)){
        svg.setAttribute(attr, attributes[attr]);
      }
    }
    return svg;
  }
  catch(e){
    throw e;
  }
}

module.exports = createSVGElem;

},{}],4:[function(require,module,exports){
function getWidth() {
  if (self.innerHeight) {
    return self.innerWidth;
  }

  if (document.documentElement && document.documentElement.clientWidth) {
    return document.documentElement.clientWidth;
  }

  if (document.body) {
    return document.body.clientWidth;
  }
}

module.exports = getWidth;

},{}],5:[function(require,module,exports){
(function() {

  require('./bargraph-onhover');
  require('./create-plot');

})();

},{"./bargraph-onhover":1,"./create-plot":2}]},{},[5]);

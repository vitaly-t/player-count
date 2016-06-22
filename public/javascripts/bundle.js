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
      var count = 0;
      Array.prototype.forEach.call(gs[index].children, function(bar, barIndex){
        if(barIndex === ind){
          console.log(row);
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
(function createPlot(){
  var svg = document.getElementById('svg-totals-plot').getElementsByTagName('g')[0];
  var bounds = svg.getBoundingClientRect();
  var xInterval = Math.floor(bounds.width/7);
  var yInterval = Math.floor(bounds.height/6);
  
  var points = "";
  for(var i = 0; i < bounds.width; i+=xInterval){
    points += i + "," + Math.floor(Math.random() * bounds.height) + " ";
  }
  points = points.slice(0,points.length-1);

  var polyline = createSVGElem("polyline", {
    points: points,
    style: "fill:none;stroke:white;stroke-width:1"
  });

  var pointsArray = polyline.getAttribute("points").split(" ");
  pointsArray = pointsArray.map(function(point){
    return point.split(",");
  });

  // Create Vertical Plot lines.
  for(var i = xInterval; i < bounds.width - xInterval; i+= xInterval){
    var line = createSVGElem("line", {
      x1: i,
      y1: 0,
      x2: i,
      y2: bounds.height,
      stroke: "#262626",
      "stroke-width": "1",
    });
    svg.appendChild(line);
  }

  // Create Horizontal Plot lines.
  for(var i = yInterval; i < bounds.height; i+= yInterval){
    var line = createSVGElem("line", {
      x1: 0,
      y1: i,
      x2: bounds.width,
      y2: i,
      stroke: "#262626",
      "stroke-width": "1",
    });
    svg.appendChild(line);
  }

  svg.appendChild(polyline);
  //svg.addEventListener('mousemove',getNearestLine,false);
//  svg.addEventListener('mouseout',clearOverlayLines,false);

  for(var i = 0; i < bounds.width; i+= xInterval){
    var line = createSVGElem("line", {
      x1: i,
      y1: 0,
      x2: i,
      y2: bounds.height,
      stroke: "red",
      "stroke-width": "2",
      style: "opacity:0",
    });
    line.classList = "overlay";
    line.addEventListener("mouseover",toggleOverlay,false);
    svg.appendChild(line);
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
//    svg.appendChild(g);
//    
//  }

function toggleOverlay(e){
  console.log("over");
  var overlays = document.getElementsByClassName("overlay");
  Array.prototype.forEach.call(overlays,function(line){
    line.style.opacity = 0;
  });
  e.target.style.opacity = 1;
  document.getElementById('count-display').innerHTML = bounds.height - pointsArray.filter(function(point){  return point[0] === e.target.getAttribute("x1"); })[0][1] + " Players";
}


//  function getNearestLine(e){
//    var x = e.clientX - bounds.left;
//    var lines = document.getElementsByClassName("overlay");
//    var close = Array.prototype.filter.call(lines, function(line){
//      return Math.abs(line.getAttribute('x1') - x) < xInterval;
//    });
//    if(close.length > 0){
//      if(close.length == 1){
//        var closest = close[0];
//      }
//      else{
//        var closest = Math.abs(close[0].getAttribute("x1") - x) < Math.abs(close[1].getAttribute("x1") - x) ? close[0] : close[1];
//      }
//      Array.prototype.forEach.call(lines,function(line,index){
//        line.style.opacity = 0;
//      });
//      closest.style.opacity = 1;
//      document.getElementById('count-display').innerHTML = bounds.height - pointsArray.filter(function(point){  return point[0] === closest.getAttribute("x1"); })[0][1] + " Players";
//    }
//  }

  function clearOverlayLines(e){
    var lines = document.getElementsByClassName("overlay");
    Array.prototype.forEach.call(lines, function(line){
      line.style.opacity = 0;
    });
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

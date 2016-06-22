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
var getWidth = require('./get-width');
(function createPlot(){
  var svg = document.getElementById('svg-totals-plot').getElementsByTagName('g')[0];
  var bounds = svg.getBoundingClientRect();
  var xInterval = Math.floor(bounds.width/7);
  var yInterval = Math.floor(bounds.height/6);
  var lineInterval = Math.floor(bounds.width/300); 
  
  var points = "";
  for(var i = 0; i < bounds.width; i+=50){
    points += i + "," + Math.floor(Math.random() * bounds.height) + " ";
  }
  points = points.slice(0,points.length-1);
  var polyline = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
  polyline.setAttribute("points", points);
  polyline.setAttribute("style", "fill:none;stroke:white;stroke-width:1");
  var pointsArray = polyline.getAttribute("points").split(" ");
  pointsArray = pointsArray.map(function(point){
    return point.split(",");
  });

  for(var i = xInterval; i < bounds.width - xInterval; i+= xInterval){
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", i);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", i);
    line.setAttribute("y2", bounds.height);
    line.setAttribute("stroke","#262626");
    line.setAttribute("stroke-width","1");
    svg.appendChild(line);
  }
  for(var i = yInterval; i < bounds.height; i+= yInterval){
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 0);
    line.setAttribute("y1", i);
    line.setAttribute("x2", bounds.width);
    line.setAttribute("y2", i);
    line.setAttribute("stroke","#262626");
    line.setAttribute("stroke-width","1");
    svg.appendChild(line);
  }
  svg.appendChild(polyline);
  svg.addEventListener('mouseover',getNearestLine,false);

  for(var i = 0; i < bounds.width; i+= 50){
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.classList = "overlay";
    line.setAttribute("x1", i);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", i);
    line.setAttribute("y2", bounds.height);
    line.setAttribute("stroke","red");
    line.setAttribute("stroke-width","2");
    line.addEventListener('mouseover',lineMouseOver, false);
    line.addEventListener('mouseout',lineMouseOut, false);
    line.style.opacity = 0;

    svg.appendChild(line);
  }

  function getNearestLine(e){
    var x = e.clientX - bounds.left;
    var closest = 0;
    var lines = document.getElementsByClassName("overlay");
    for(var i = 0; i < lines.length-1; i++){
      var currX = lines[i].getAttribute("x1");
      var nextX = lines[i+1].getAttribute("x1");
      if(Math.abs(currX - x) < 50){
        closest = Math.abs(currX-x) < Math.abs(nextX-x) ? currX : nextX;
        break;
      }
    }
    console.log(closest);
  }

  function lineMouseOver(e){
    e.target.style.opacity = 1;
    var x = e.target.getAttribute("x1");
    //console.log(pointsArray.filter(function(point){ return point[0] === x;  })[0][1]);

  }
  function lineMouseOut(e){
    e.target.style.opacity = 0;

  }

})();

},{"./get-width":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
(function() {

  require('./bargraph-onhover');
  require('./create-plot');

})();

},{"./bargraph-onhover":1,"./create-plot":2}]},{},[4]);

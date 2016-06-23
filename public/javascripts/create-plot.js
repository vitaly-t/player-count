var getWidth = require('./helpers/get-width');
var createSVGElem = require('./helpers/create-svg-elem');

(function createPlot(){
  var svg = document.getElementById('svg-totals-plot');
  var plot = svg.getElementById('g-plot');
  var bounds = svg.getBoundingClientRect();
  var X_INTERVAL = Math.floor(100/8);
  var Y_INTERVAL = Math.floor(100/8);
  var Y_INTERVAL_PIX = Y_INTERVAL/100 * bounds.height;
  
  var points = "";
  // Point coordinates determined as percentage of width.
  for(var i = X_INTERVAL; i < 100; i+=X_INTERVAL){
    // There are 7 increments hence the max value of y is as below.
    var y = Math.floor(Math.random() * (7 * Y_INTERVAL_PIX));
    points += Math.floor(i/100 * bounds.width) + "," + y + " ";
  }
  points = points.slice(0,points.length-1);

  var polyline = createSVGElem("polyline", {
    points: points,
    style: "fill:none;stroke:white;stroke-width:1",
  });

  var pointsArray = polyline.getAttribute("points").split(" ");
  pointsArray = pointsArray.map(function(point){
    return point.split(",");
  });
  console.log(pointsArray,bounds.height);

  // Create Vertical Plot lines.
  for(var i = X_INTERVAL; i < 100; i+= X_INTERVAL){
    var line = createSVGElem("line", {
      x1: i+"%",
      y1: 0+"%",
      x2: i+"%",
      y2: 100+"%",
      stroke: "#262626",
      "stroke-width": "1",
    });
    var text = createSVGElem("text",{
      x:(i-5)+"%",
      y:100+"%",
      "font-size": 15,
      fill: "#7a7a7a"
    });
    text.appendChild(document.createTextNode("Day"));
    plot.appendChild(line);
    plot.appendChild(text);
  }

  // Create Horizontal Plot lines.
  var playerCount = 3;
  for(var i = Y_INTERVAL; i < 100; i+= Y_INTERVAL){
    if(playerCount >= 0){
      var line = createSVGElem("line", {
        x1: 0+"%",
        y1: i+"%",
        x2: 100+"%",
        y2: i+"%",
        stroke: "#262626",
        "stroke-width": "1",
      });
      plot.appendChild(line);
      var text = createSVGElem("text",{
        "font-size":15,
        fill: "#7a7a7a",
        x: 0,
        y: i+"%",
      });
      text.appendChild(document.createTextNode(playerCount + "M"));
      playerCount -= 0.5;
      plot.appendChild(text);
    }
  }

  plot.appendChild(polyline);
  // Use mouseleave instead of mouseout, as the latter triggers when mousing
  // over descendant elements.
  svg.addEventListener('mouseleave',hideOverlay,false);
	svg.addEventListener('mouseenter',showOverlay,false);
  svg.addEventListener('mousemove',moveOverlay,false);

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

  function moveOverlay(e){
    var overlay = document.getElementById('overlay');
    var overlayX = overlay.getAttribute("x");
    var cursorX = Math.floor(e.clientX - (getWidth() - bounds.width)/2);
    var xDiff = cursorX - overlayX;
    overlay.setAttribute("transform",'translate('+xDiff+',0)');
    if(cursorX % Math.floor(X_INTERVAL/100 * bounds.width) === 0){
      document.getElementById('count-display').innerHTML = (3.5 * ((7 * Y_INTERVAL_PIX - pointsArray.filter(function(point){ return point[0] == cursorX; })[0][1])/(7 * Y_INTERVAL_PIX))).toFixed(2) + "M Players";
    //(3 * (bounds.height - Y_INTERVAL_PIX - pointsArray.filter(function(point){  return point[0] == cursorX; })[0][1])/(bounds.height - Y_INTERVAL_PIX)).toFixed(2) + " Million Players";
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

function toggleOverlay(e){
  console.log("over");
  var overlays = document.getElementsByClassName("overlay");
  Array.prototype.forEach.call(overlays,function(line){
    line.style.opacity = 0;
  });
  e.target.style.opacity = 1;
  if(e.target.getAttribute("x1") % xInterval === 0){
    document.getElementById('count-display').innerHTML = bounds.height - pointsArray.filter(function(point){  return point[0] === e.target.getAttribute("x1"); })[0][1] + " Players";
  }
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

  function hideOverlay(e){
    document.getElementById("overlay").style.opacity = 0;
    document.getElementById('count-display').innerHTML = "Hover over the plot to see player counts";
  }
	function showOverlay(e){
    document.getElementById("overlay").style.opacity = 1;
	}

})();
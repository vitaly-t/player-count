var getWidth = require('./helpers/get-width');
var createSVGElem = require('./helpers/create-svg-elem');
(function createPlot(){
  var svg = document.getElementById('svg-totals-plot');
  var plot = svg.getElementById('g-plot');
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
    plot.appendChild(line);
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
    plot.appendChild(line);
  }

  plot.appendChild(polyline);
  // Use mouseleave instead of mouseout, as the latter triggers when mousing
  // over descendant elements.
  svg.addEventListener('mouseleave',clearOverlayLines,false);

  for(var i = 0; i < bounds.width; i+= xInterval){
    var line = createSVGElem("line", {
      x1: i,
      y1: 0,
      x2: i,
      y2: bounds.height,
      stroke: "red",
      "stroke-width": "3",
      style: "opacity:0",
    });
    line.classList = "overlay";
    line.addEventListener("mouseover",toggleOverlay,false);
    plot.appendChild(line);
    for(var j = i; j < i + xInterval; j+=10){
      var line = createSVGElem("line", {
        x1: j,
        y1: 0,
        x2: j,
        y2: bounds.height,
        stroke: "red",
        "stroke-width": "3",
        style: "opacity:0",
      });
      line.classList = "overlay";
      line.addEventListener("mouseover",toggleOverlay,false);
      plot.appendChild(line);
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

  function clearOverlayLines(e){
    var lines = document.getElementsByClassName("overlay");
    Array.prototype.forEach.call(lines, function(line){
      line.style.opacity = 0;
    });
  }

})();

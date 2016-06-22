var getWidth = require('./get-width');
(function createPlot(){
  var svg = document.getElementById('svg-totals-plot').getElementsByTagName('g')[0];
  var bounds = svg.getBoundingClientRect();
  var xInterval = Math.floor(bounds.width/7);
  var yInterval = Math.floor(bounds.height/6);
  var lineInterval = Math.floor(bounds.width/300); 
  
  var points = "";
  for(var i = 0; i < bounds.width; i+=10){
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
  svg.addEventListener('mousemove',getNearestLine,false);
//  svg.addEventListener('mouseout',clearOverlayLines,false);

  for(var i = 0; i < bounds.width; i+= 10){
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.classList = "overlay";
    line.setAttribute("x1", i);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", i);
    line.setAttribute("y2", bounds.height);
    line.setAttribute("stroke","red");
    line.setAttribute("stroke-width","2");

    line.style.opacity = 0;

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

  function getNearestLine(e){
    var x = e.clientX - bounds.left;
    var closest;
    var lines = document.getElementsByClassName("overlay");
    for(var i = 0; i < lines.length-1; i++){
      var currX = lines[i].getAttribute("x1");
      var nextX = lines[i+1].getAttribute("x1");
      if(Math.abs(currX - x) < 10){
        closest = Math.abs(currX-x) < Math.abs(nextX-x) ? lines[i] : lines[i+1];
        break;
      }
    }
    Array.prototype.forEach.call(lines,function(line,index){
      line.style.opacity = 0;
    });
    closest.style.opacity = 1;
    document.getElementById('count-display').innerHTML = bounds.height - pointsArray.filter(function(point){  return point[0] === closest.getAttribute("x1"); })[0][1] + " Players";
  }

  function clearOverlayLines(e){
    var lines = document.getElementsByClassName("overlay");
    Array.prototype.forEach.call(lines, function(line){
      line.style.opacity = 0;
    });
  }

  function lineMouseOver(e){
    e.target.style.opacity = 1;
    var x = e.target.getAttribute("x1");
  }
  function lineMouseOut(e){
    e.target.style.opacity = 0;
  }

})();

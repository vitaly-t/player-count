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

  for(var i = 0; i < bounds.width; i+= 10){
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.classList = "overlay";
    line.setAttribute("x1", i);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", i);
    line.setAttribute("y2", bounds.height);
    line.setAttribute("stroke","red");
    line.setAttribute("stroke-width","2");
    //line.addEventListener('mouseover',lineMouseOver, false);
    //line.addEventListener('mouseout',lineMouseOut, false);
    line.style.opacity = 0;

    svg.appendChild(line);
  }

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
    console.log(closest);
    Array.prototype.forEach.call(lines,function(line,index){
      line.style.opacity = 0;
    });
    closest.style.opacity = 1;

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

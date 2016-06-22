(function createPlot(){
  var svg = document.getElementById('svg-totals-plot').getElementsByTagName('g')[0];
  var bounds = svg.getBoundingClientRect();
  var xInterval = Math.floor(bounds.width/7);
  var yInterval = Math.floor(bounds.height/6);
  var lineInterval = Math.floor(bounds.width/300);
  
  var d = "M ";
  for(var i = 0; i < bounds.width; i+=lineInterval){
    d += i + " " + Math.floor(Math.random() * bounds.height) + " L ";
  }
  d = d.slice(0,d.length-3);
  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  path.setAttribute("style", "fill:none;stroke:white;stroke-width:1");
  //var pointsArray = polyline.getAttribute("points").split(" ");
 // pointsArray = pointsArray.map(function(point){
  //  return point.split(",");
  //});

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
  svg.appendChild(path);
  for(var i = 0; i < bounds.width; i+= lineInterval){
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

  function lineMouseOver(e){
    e.target.style.opacity = 1;
    var x = e.target.getAttribute("x1");
    //console.log(pointsArray.filter(function(point){ return point[0] === x;  })[0][1]);

  }
  function lineMouseOut(e){
    e.target.style.opacity = 0;
  }

})();

(function createPlot(){
  var svg = document.getElementById('svg-totals-plot');
  var bounds = svg.getBoundingClientRect();
  for(var i = 0; i < bounds.width; i+= Math.floor(bounds.width/7)){
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", i);
    line.setAttribute("y1", 0);
    line.setAttribute("x2", i);
    line.setAttribute("y2", bounds.height);
    line.setAttribute("stroke","red");
    line.setAttribute("stroke-width","2");
    svg.appendChild(line);
  }
  for(var i = 0; i < bounds.height; i+= Math.floor(bounds.height/6)){
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", 0);
    line.setAttribute("y1", i);
    line.setAttribute("x2", bounds.width);
    line.setAttribute("y2", i);
    line.setAttribute("stroke","grey");
    line.setAttribute("stroke-width","2");
    svg.appendChild(line);
  }
})();

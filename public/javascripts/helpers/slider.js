(function createSlider(){
  var CONTAINER_ID = 'slider';
  var margin = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };
  var height = 560 - margin.top - margin.bottom;
  var width = 300 - margin.width - margin.right;

  var svg = d3.select("div#" + CONTAINER_ID)
    .append("div")
    .classed("svg-container", true)
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "0 0 " + (width + margin.left + margin.right + 20 + (ON_INDEX_PAGE ? 10 : 0)) + " " + (height + margin.top + margin.bottom))
    .classed("svg-content-responsive", true)
    .append("g")
    .attr("transform", "translate(" + (margin.left + 30) + "," + (margin.top-10) + ")"); // So x axis isn't cut off.

})();

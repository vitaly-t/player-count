(function setupDateInputs() {

  var start = document.getElementById('start');
  var end = document.getElementById('end');
  var url = window.location.href;
  start.addEventListener('keypress', updateSvgTimeData, true);
  end.addEventListener('keypress', updateSvgTimeData, true);
  

  function updateSvgTimeData(e) {
    if(e.keyCode === 13){
      var start = Date.parse(document.getElementById('start').value);
      var end = Date.parse(document.getElementById('end').value);

      var appid = url.slice(url.lastIndexOf('/')+1);

      if (isNaN(start) || isNaN(end)) {
        console.log('One of the inputs was not a number.');
        return false;
      }
      $.getJSON('/api/countsBetweenDates/?appid='+appid+'&start=' + start + '&end=' + end, function(counts) {
        if(playerCounts.length !== 0){
          var margin = {
              top: 20,
              right: 20,
              bottom: 20,
              left: 10
            },
            width = 560 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

          var TICK_SIZE_X = 5;
          var TICK_SIZE_Y = 5;


          playerCounts = {
            count: counts.map(function(record) {
              return record.count;
            }),
            updated: counts.map(function(record) {
              return record.updated;
            })
          };
          // Ensure playerCounts is an array 
          playerCounts = Array.isArray(playerCounts) ? playerCounts : [playerCounts];
          if (playerCounts.length === 0) return;

          var lineData = [];
          var dates = [];
          for (var i = 0; i < playerCounts.length; i++) {
            dates[i] = [];
            lineData[i] = [];
          }

          playerCounts.forEach(function(playerCount, lIndex) {
            lineData[lIndex] = playerCount.count.map(function(count, cIndex) {
              var date = new Date(playerCount.updated[cIndex]);
              date.setHours(0, 0, 0, 0); // Set Hours to properly align points with xaxis in D3
              if (dates[lIndex].indexOf(date.getDate()) == -1) {
                dates[lIndex].push(date.getDate());
                return {
                  x: date,
                  y: count
                };
              }
            });
            lineData[lIndex] = lineData[lIndex].filter(function(point) {
              return point !== undefined;
            });
          });

          var x = d3.time.scale()
            .domain(d3.extent(
              lineData.reduce(function(total, lineDatum) {
                return total.concat(lineDatum.map(function(datum) {
                  return datum.x;
                }));
              }, [])
            ))
            .nice(d3.time.day, 1)
            .range([0, width]);
          var y = d3.scale.linear()
            .domain(d3.extent(
              lineData.reduce(function(total, lineDatum) {
                return total.concat(lineDatum.map(function(datum) {
                  return datum.y;
                }));
              }, [])
            ))
            .range([height, 0]);
          var lineFunction = d3.svg.line()
              .x(function(d) {
                console.log(d.x);
                return x(d.x);
              })
              .y(function(d) {
                console.log(d);
                return y(d.y);
              })
              .interpolate("monotone");
          var formatDate = d3.time.format("%d %b");
          var formatYAxis = function(d) {
            if ((d / 1000000) >= 1) {
              d = d / 1000000 + "M";
            } else if ((d / 1000) >= 1) {
              d = d / 1000 + "K";
            }
            return d;
          };

          var NUMBER_OF_TICKS = 6;

          var xAxis = d3.svg.axis()
              .scale(x)
              .tickFormat(formatDate)
              .ticks(NUMBER_OF_TICKS)
              .tickSize(TICK_SIZE_X, 0, 0)
              .orient("bottom");
          var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(formatYAxis)
            .tickSize(TICK_SIZE_Y, 0, 0)
            .ticks(NUMBER_OF_TICKS);



          var svg = d3.select('div#game-plot').transition();
          lineData.forEach(function(lineDatum){
            console.log(svg.select('path'));
            svg.select('.line')
              .duration(750)
              .attr("d",lineFunction(lineDatum));
						svg.select(".x.axis") // change the x axis
							.duration(750)
							.call(xAxis);
						svg.select(".y.axis") // change the y axis
							.duration(750)
							.call(yAxis);
          });

        }
      });
    }

  }
  


})();

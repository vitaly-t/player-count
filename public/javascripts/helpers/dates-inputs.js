(function setupDateInputs() {

  var svgBuilder = require('./gen-ind-svg-from-array');
  var start = document.getElementById('start');
  var end = document.getElementById('end');
  var url = window.location.href;
  var changed = false;

  start.addEventListener('keypress', updateSvgTimeData, true);
  end.addEventListener('keypress', updateSvgTimeData, true);

  start.addEventListener('focus', presentFormattedDate, true);
  end.addEventListener('focus', presentFormattedDate, true);

  //start.addEventListener('focusout', removeFormattedDate, true);
  //end.addEventListener('focusout', removeFormattedDate, true);

  function presentFormattedDate(){
    var date;
    var id = this.id;
    if(id == 'start'){
      date = start.value ? start.value : new Date(Date.parse(start.getAttribute('placeholder')));
    }
    else{
      date = end.value ? end.value : new Date(Date.parse(end.getAttribute('placeholder')));
    }
    var year = date.getFullYear();
    var month = date.getUTCMonth() + 1;
    var day = date.getUTCDate() + 1;
    var formattedDate = date.getFullYear() + '-' + (month < 9 ? "0" + month : month) + '-' + (day < 9 ? "0" + day : day);
    console.log(new Date(Date.parse(formattedDate)).toDateString());
    if(id == 'start'){
      start.value = formattedDate;
    }
    else{
      end.value = formattedDate;
    }
  }

  function removeFormattedDate(){
    var id = this.id;
    if(id == 'start'){
      console.log(start.value);
      start.value = new Date(Date.parse(start.value)).toDateString();
    }
    else{
      end.value = new Date(Date.parse(end.value)).toDateString();
    }
  }

  function updateSvgTimeData(e) {
    if (e.keyCode === 13) {
      var start = Date.parse(document.getElementById('start').value);
      var end = Date.parse(document.getElementById('end').value);

      var appid = url.slice(url.lastIndexOf('/') + 1);

      if (isNaN(start) || isNaN(end)) {
        console.log('One of the inputs was not a number.');
        return false;
      }
      $.getJSON('/api/countsBetweenDates/?appid=' + appid + '&start=' + start + '&end=' + end, function(counts) {
        if (playerCounts.length !== 0) {
          var ON_INDEX_PAGE = svgBuilder.ON_INDEX_PAGE;
          var TICK_SIZE_X = svgBuilder.TICK_SIZE_X;
          var TICK_SIZE_Y = svgBuilder.TICK_SIZE_Y;
          var NUMBER_OF_TICKS = svgBuilder.NUMBER_OF_TICKS;
          var x = svgBuilder.x;
          var y = svgBuilder.y;
          var margin = svgBuilder.margin;
          var height = svgBuilder.height;
          var width = svgBuilder.width;
          var formatDate = svgBuilder.formatDate;
          var formatYAxis = svgBuilder.formatYAxis;

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
          // NOTE: Previously I had redefined x and y here. That was incorrect
          // - doing so meant that the x and y functions used by the altered
          // graph were different than those still being used in the mousemove
          // function 'movementHandler'. As such, while the axes and graph were
          // correct, that number being shown to the user (the result of
          // x.invert(pos.x) was incorrect.
          // As such, I've now only altered the domain property. This changes
          // the property of the underlying referenced object and hence the
          // mouseover function.
          x.domain(d3.extent(
              lineData.reduce(function(total, lineDatum) {
                return total.concat(lineDatum.map(function(datum) {
                  return datum.x;
                }));
              }, [])
            ))
            .nice(d3.time.day, 1)
            .range([0, width]);
          y.domain(d3.extent(
              lineData.reduce(function(total, lineDatum) {
                return total.concat(lineDatum.map(function(datum) {
                  return datum.y;
                }));
              }, [])
            ))
            .range([height, 0]);

          var lineFunction = d3.svg.line()
            .x(function(d) {
              return x(d.x);
            })
            .y(function(d) {
              return y(d.y);
            })
            .interpolate("monotone");
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
          svgBuilder.x = x;
          svgBuilder.y = y;

          var svg = d3.select('div#game-plot').transition();
          lineData.forEach(function(lineDatum, index) {
            svg.select(".line")
              .duration(750)
              .attr("d", lineFunction(lineDatum));
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

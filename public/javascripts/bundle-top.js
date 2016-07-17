(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function prettifyNumber(number){
  if(isNaN(number)) return number;
  var sNum = number + "";
  var aNum = sNum.split("");
  var count = 1;
  // Check for decimal. We substract 1 from aNum.indexOf('.') so that we start
  // at the first digit before the decimal.
  var start = (aNum.indexOf('.') !== -1) ? aNum.indexOf('.')-1 : aNum.length-1;
  // Ignore '-' if present.
  var end = (aNum.indexOf('-') !== -1) ? 1 : 0;
  for(var i = start; i > end; i--){
    if(count % 3 === 0){
      aNum[i] = "," + aNum[i];
    }
    count++;
  }
  return aNum.join("");
}

module.exports = prettifyNumber;

},{}],2:[function(require,module,exports){
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
          var count = bar.getAttribute('data-count');
          var dailyDisplay = row.getElementsByClassName('daily-display')[0];
          dailyDisplay.innerHTML = prettifyNumber(count);
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
  // May want to just require this latter.
  function prettifyNumber(number){
    var sNum = number + "";
    var aNum = sNum.split("");
    var count = 1;
    for(var i = aNum.length-1; i >= 0; i--){
      if(count % 3 === 0 && i !== 0){
        aNum[i] = "," + aNum[i];
      }
      count++;
    }
    return aNum.join("");
  }

})();

},{}],3:[function(require,module,exports){
(function sliderSetup(){
  // Don't execute if window size is too large.
  if($(window).width() > 1190)  return;
  // *** BARGRAPH DOM AND SVG ELEMENTS *** //
  var bars = document.getElementsByClassName('bargraph-bar');
  var bargraphs = document.getElementsByClassName('bargraph');
  var gs = document.getElementsByClassName('g-bargraph');
  var rows = document.getElementsByClassName('top-game-row');
  var dailyPlayers = document.getElementById('daily-players');

  // *** FUNCTIONS *** // 
  var prettifyNumber = require('../../../functions/prettify-number');
  
  var margins = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20
  };
  var width = 500 - margins.left - margins.right;
  var height = 100 - margins.top - margins.bottom;
  var vMiddle = Math.floor(height/2);
  var radius = 10;
  var strokeWidth = 3;
  var colors = {
    circle: '#f96900',
    line: '#dce2c8',
    fill: '#65def1'
  };
  var SLIDER_ID = 'mobile-slider';
  var oldBarNum;

  var svg = d3.select('div#game-list')
    .selectAll('table')
    .selectAll('tfoot')
    .insert('tr',':first-child')
    .attr('id','mobile-slider-row')
    .append('td')
    .attr('colspan','6')
    .attr('class','tfootTD')
    .append('svg')
    .attr('width',width)
    .attr('height',height)
    .append('g');
  var overlay = 
    svg.append('rect')
    .attr('width',width)
    .attr('height',height)
    .attr('fill','none')
    .attr('pointer-events','all')
    .on('touchmove',function(){
      var touchX = d3.touches(this)[0][0];
      var barNum;
      if(touchX >= radius && touchX <= width - radius){
        sliderCircle
          .attr('transform','translate('+(touchX-radius)+',0)');
        sliderFill
          .attr('x2',touchX);
        barNum = Math.floor(touchX / (width - 2 * radius) * numberOfBars);
        if((oldBarNum && oldBarNum === barNum) || (barNum === numberOfBars)){
          return false;
        }
        oldBarNum = barNum;
        Array.prototype.forEach.call(rows,function(row,index){
          var dailyDisplay = row.getElementsByClassName('daily-display')[0];
          var count = 0;
          var time;
          Array.prototype.forEach.call(gs[index].children,function(bar,barIndex){
            if(barIndex === barNum){
              if(!time){
                time = bar.getAttribute('data-time');
              }
              var count = bar.getAttribute('data-count');
              var dailyDisplayers = row.getElementsByClassName('daily-display')[0];
              dailyDisplay = row.getElementsByClassName('daily-display')[0];
              dailyDisplay.innerHTML = prettifyNumber(count);
              bar.style.opacity = 1;
            }
            else{
              bar.style.opacity = 0.5; 
            }
            
            });
          time = new Date(time);
          time = time.toDateString();
          dailyPlayers.innerHTML = time;
          });
        }
    });
  var sliderLine = 
    svg.append('line')
    .attr('pointer-events','none')
    .attr('x1', radius)
    .attr('y1', vMiddle)
    .attr('x2', width - radius)
    .attr('y2', vMiddle)
    .attr('stroke', colors.line)
    .attr('stroke-width', strokeWidth);
  var sliderFill = 
    svg.append('line')
    .attr('pointer-events','none')
    .attr('x1', radius)
    .attr('y1', vMiddle)
    .attr('x2', radius)
    .attr('y2', vMiddle)
    .attr('stroke', colors.fill)
    .attr('stroke-width',strokeWidth);
  var sliderCircle = 
    svg.append('circle')
    .attr('pointer-events','none')
    .attr('cx',radius)
    .attr('cy',vMiddle)
    .attr('r',radius)
    .attr('fill',colors.circle);

  console.log(svg);
})();

},{"../../../functions/prettify-number":1}],4:[function(require,module,exports){
(function() {
  require('./helpers/bargraph-onhover');
  require('./helpers/slider');
})();

},{"./helpers/bargraph-onhover":2,"./helpers/slider":3}]},{},[4]);

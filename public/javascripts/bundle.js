(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function setupBargraphOnhover(){
  var bars = document.getElementsByClassName('bargraph-bar');
  var bargraphs = document.getElementsByClassName('bargraph');

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
    var count = e.target.getAttribute('data-count');
    var time = e.target.getAttribute('data-time');
    time = new Date(time);
    time = time.toDateString();
    var display = document.getElementById(appid);
    display.innerHTML = count + " players " + "</br>" + " on " + time;
  }

  function barMouseOutHandler(e){
    var appid = e.target.getAttribute('data-appid');
    var display = document.getElementById(appid);
    display.innerHTML = "";
  }

})();

},{}],2:[function(require,module,exports){
(function() {

  require('./bargraph-onhover');

})();

},{"./bargraph-onhover":1}]},{},[2]);

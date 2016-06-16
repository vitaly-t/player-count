(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function(){

  var canvas = document.getElementById('my-canvas');
  canvas.width = 800;
  canvas.height = 200;

  var ctx = canvas.getContext('2d');
  var yValues = [25,80,48,38,69,100];
  ctx.beginPath();
  var pos = {x:0,y: 200};
  yValues.forEach(function(y){
    ctx.rect(pos.x,pos.y-y,20,y);
    pos.x += 20;
  });
  ctx.stroke();
  console.log('tst');

})();

},{}],2:[function(require,module,exports){
(function() {

  //require('./interp-poly.js');
  //require('./canvas.js');
  require('./bargraph.js');

})();

},{"./bargraph.js":1}]},{},[2]);

(function setupBargraphOnhover(){
  console.log('start');
  var bars = document.getElementsByClassName('bargraph-bar');
  var bargraphs = document.getElementsByClassName('bargraph');
  // Remember that the object returned by document.getElementsByClassName is
  // NOT an array. It is an HTML Collection, hence why we do the following:
  Array.prototype.forEach.call(bars, function(bar){
    bar.addEventListener('mouseover', barMouseOverHandler, false);
  });

  Array.prototype.forEach.call(bargraphs,function(bargraph){
    bargraph.addEventListener('mouseout', barMouseOffHandler, false);
  });


  function barMouseOverHandler(e){
    var name = e.target.getAttribute('data-name');
    var count = e.target.getAttribute('data-count');
    var time = e.target.getAttribute('data-time');
    time = new Date(time);
    time = time.toDateString();
    var display = document.getElementById(name + '-count-display');
    display.innerHTML = count + " players " + "</br>" + " on " + time;
  }

  function barMouseOffHandler(e){
    var name = e.target.getAttribute('data-name');
    var display = document.getElementById(name + '-count-display');
    display.innerHTML = "";
  }

})();

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

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
        console.log(counts);
        if(counts.length !== 0){
          console.log(counts);
        }
      });
    }

  }
  


})();

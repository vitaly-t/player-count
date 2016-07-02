(function comparePageSetup(){
  var cmpInput = document.getElementById('newComparison');
  cmpInput.addEventListener('keypress',function(e){
    if(e.keyCode === 13){
      window.location = 'http://localhost:8080/compare/' + appids.join(',') + ',' + cmpInput.value;
      return false;
    }
    return true;
  });

})();

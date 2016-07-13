(function comparePageSetup() {
  var cmpInput = document.getElementById('newComparison');
  if(cmpInput){
    var cmpImg = document.getElementById('game-selection-img');
    var found = null;

    // Want to use 'keyup' rather than 'keypress', as the latter are fired BEFORE
    // the value of the key is added to the  input.
    cmpInput.addEventListener('keyup', function(e) {
      if(cmpInput.value.length === 0){
        cmpImg.src='';
      }
      else if (cmpInput.value.length > 3) {
        if (found === null || (found && found.name.indexOf(cmpInput.value) === -1)) {
          $.getJSON('/api/partialSearch/?search=' + cmpInput.value, function(match) {
            if (match !== null) {
              cmpImg.src = '../images/' + match.appid + ".jpg";
              found = match;
            } else {
              cmpImg.src = '';
            }
          });
        }
      }
      if (e.keyCode === 13) {
        if (found !== null && appids.indexOf(found.appid) === -1) {
          appids = appids.concat(found.appid);
          window.location = 'http://localhost:8080/compare/' + appids.slice(-4).join(',');
          return false;
        }
      }
      return true;
    });
    cmpInput.addEventListener('keydown', function(e) {
      if (e.keyCode == 46 || e.keyCode == 8) {
        //cmpImg.src = '';
        found = null;
      }
    });
  }

})();

(function comparePageSetup(){
  var cmpInput = document.getElementById('newComparison');
  cmpInput.addEventListener('keypress',function(e){
    if(cmpInput.value.length > 2){
      $.getJSON('/api/partialSearch/?search='+cmpInput.value,function(assocAppid){
        if(assocAppid !== null){
          document.getElementById('game-selection-img').src='../images/'+assocAppid+".jpg";
        }
      });
    }
    if(e.keyCode === 13){
      $.getJSON('/api/partialSearch/?search='+cmpInput.value,function(assocAppid){
        if(assocAppid !== null){
          window.location = 'http://localhost:8080/compare/' + appids.join(',') + ',' + assocAppid;
          return false;
        }
      });
    }
    return true;
  });
  cmpInput.addEventListener('keydown',function(e){
    if(e.keyCode == 46 || e.keyCode == 8){
      document.getElementById('game-selection-img').src='';
    }
  });

})();

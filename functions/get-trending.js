function getTrending(arr){
  var trending = [];
  arr.forEach(function(game){
    var stats = {
      name: game.name,
      curr: game.count[game.count.length-1],
      diff: ((game.count[game.count.length-1] / game.count[game.count.length-2]) * 100).toFixed(2)
    };
    trending.push(stats);
  });

  trending.sort(function(a,b){
    if(a.diff < b.diff){
      return 1;
    }
    if(a.diff > b.diff){
      return -1;
    }
    return 0;
  });

  return trending.slice(0,5);

}

module.exports = getTrending;

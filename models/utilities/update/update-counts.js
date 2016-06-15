var request = require('request');
var promise = require('promise');

// Use 'rootpath' module so subsequent requires are made relative to root path.
require('rootpath')();
var apiInfo = require('config/api');
var db = require('config/db');

function updateCounts(){
  var curr = [];
  var updated = [];
  db.any("SELECT appid FROM player_counts WHERE count > 100")
    .then(function(data){
      curr = data;
      checkAgainstSteam();
    })
    .catch(function(err){
      throw err;
    });

  function checkAgainstSteam(){
    var URL = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=' + apiInfo.key + '&appid=';
    var requests = [];
    // IT IS POSSIBLE TO PIPE REQUESTS TO OTHER REQUESTS!
    // Plan will be to make a request to Steam's API.
    // Upon making a successful request, pipe the result to an API endpoint on
    // our end (via 'PUT') which will then update the database with the
    // information.
    request(URL + appid).pipe(request.put("http://localhost:8080/api/updateCounts"));

    
  }

  function makeRequest(){

  }


}

module.exports = updateCounts;

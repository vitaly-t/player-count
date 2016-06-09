var express = require('express');
var path = require('path');
var request = require('request');
var pgp = require('pg-promise')();

var apiInfo = require('./config/api');
var key = apiInfo.key;

var db = pgp("postgres://localhost:5432/steam");

var app = express();

app.set('view engine', 'pug');

// Prettify JSON
app.set('json spaces', 2);

function getPairs(data){
  var pairs = "";
  data.forEach(function(datum){
    pairs += "(" + datum[0] + "," + datum[1] + "),";
  });
  pairs = pairs.substring(0,pairs.length-1);
  return pairs;
}

app.get('/', function(req, res){
  //var url = 'https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=' + key + '&appid=440';
  var url = 'http://api.steampowered.com/ISteamApps/GetAppList/v2/?key=' + key;

  request.get(url, function(err, apiReq, apiRes){
    if(err) throw err;
    var apps = JSON.parse(apiRes).applist.apps;
    var games = [];
    var invalidDescriptors = ["trial", "key", "demo", "trailer", "dlc", "skins", "pack"];
    for(var k = 0; k < apps.length; k++){
      // Check if the name does NOT contain any invalid descriptors
      if(!invalidDescriptors.some(function(descriptor){ return apps[k].name.toLowerCase().indexOf(descriptor) != -1;})){
        games.push([apps[k].appid, "'" + apps[k].name.replace("'","''") + "'"]);
      }
    }
		function factory(index) {
			if (index < games.length) {
          console.log(index);
					return this.query('insert into player_counts(appid,name) values($1,$2)', games[index]);
			}
		}

		db.tx(function () {
				return this.sequence(factory);
		})
			.then(function (data) {
        return res.send("SUCCESS!");
			})
			.catch(function (error) {
				done();
				console.log(error);
				return res.status(500).json({success:false});
			});
  
  });
});


app.listen(8080, function(){
  console.log("Listening on port 8080");
});

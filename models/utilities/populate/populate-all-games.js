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

  // NOTE: Both the 'factory' function and 'db.tx ...' are VERY important.
  // Initially, I had a lot of issues trying to do a bulk insert of records.
  // Previous methods/modules (like 'pg') either would not accept a single
  // massive query (here was about 26,000 records I was inserting) or would
  // push individual queries into a queue that could be maxed out (attempting
  // to add queries to a maxed out queue would result in them being ignored).
  // As such, I've since switched over to 'pg-promise'.
  // It allows for code like the below which lets you construct a sequence of
  // queries to eventually be executed in full.
  function factory(index) {
    if (index < games.length) {
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

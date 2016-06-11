var pgp = require('pg-promise')();
var db = pgp("postgres://localhost:5432/steam");
module.exports = db;

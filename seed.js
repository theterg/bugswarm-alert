var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('alert.db');

db.run("CREATE TABLE alerts ("+
	"id INTEGER NOT NULL PRIMARY KEY, "+
	"smsnum TEXT, "+
	"swarmid TEXT, "+
	"resourceid TEXT, "+
	"feed TEXT, "+
	"thresh REAL"+
	")");

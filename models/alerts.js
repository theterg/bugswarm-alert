var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('alert.db');

var getAll = function(callback) {
	db.all("SELECT * FROM alerts", function(err, rows) {
		if (typeof(callback) === "function") {
			callback(err, rows);
		}
	});
};

var getBySwarm = function(swarmid, resourceid, callback) {
	db.all("SELECT * FROM alerts WHERE swarmid=?, resourceid=?", 
		swarmid, resourceid, function(err, rows) {
		if (typeof(callback) === "function") {
			callback(err, rows);
		}
	});
};

var getID = function(id, callback) {
	db.get("SELECT * FROM alerts WHERE id=?",id, function(err, row) {
		if (typeof(callback) === "function") {
			callback(err, row);
		}
	});
};

var addAlert = function(obj, callback) {
	db.run("INSERT INTO alerts "+
		"(smsnum, swarmid, resourceid, feed, thresh) VALUES (?,?,?,?,?)", 
		obj.smsnum, obj.swarmid, obj.resourceid, obj.feed, obj.thresh, callback
	);
};

var delAlert = function(id, callback) {
	db.run("DELETE FROM alerts WHERE id=?",id,callback);
};

var updateAlert = function(obj, callback) {
	db.run("UPDATE alerts SET "+
		"smsnum=?, swarmid=?, resourceid=?, feed=?, thresh=? "+
		"WHERE id=?", 
		obj.smsnum, obj.swarmid, obj.resourceid, obj.feed, obj.thresh, obj.id,
		callback
	);
};

exports.getBySwarm = getBySwarm;
exports.updateAlert = updateAlert;
exports.delAlert = delAlert;
exports.addAlert = addAlert;
exports.getAll = getAll;
exports.getID = getID;
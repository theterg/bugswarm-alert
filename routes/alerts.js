var alerts = require('../models/alerts');

var schema = {
	smsnum: '',
	swarmid: '',
	resourceid: '',
	feed: '',
	thresh: 0.0
};

var validate = function(obj, callback) {
	var errprops = false;
	var newobj = {};
	for (var prop in schema) {
		if (!(prop in obj)) {
			if (!errprops) { errprops = []; }
			errprops.push(prop);
		}
		newobj[prop] = obj[prop];
	}
	if (errprops) {
		return callback(true, "Missing prop(s): "+JSON.stringify(errprops));
	}
	if ((newobj.smsnum.length != 12)||(newobj.smsnum[0] !== '+')) {
		return callback(true, "smsnum invalid format, should be '+12223334444'");
	}
	if (newobj.swarmid.length != 40) {
		return callback(true, "Invalid swarmid, should be a 40 character token");
	}
	if (newobj.resourceid.length != 40) {
		return callback(true, "invalid resourceid, should be a 40 character token");
	}
	return callback(null, newobj);
};

var list = function(req, res) {
	alerts.getAll(function (err, data){
		if (err) {
			res.send(500, JSON.stringify(err));
			return;
		}
		res.send(JSON.stringify(data));
	});
};

var create = function(req, res){
	validate(req.body, function(err, obj) {
		if (err) { res.send(500, obj); }
		else {
			alerts.addAlert(obj, function(err) {
				if (err) { res.send(500, JSON.stringify(err)); }
				else { res.send(201, "Added"); }
			});
		}
	});
};

var read = function(req, res) {
	alerts.getID(req.params.id, function(err, data) {
		if (err) {
			res.send(500, JSON.stringify(err));
			return;
		}
		res.send(JSON.stringify(data));
	});
};

var update = function(req, res) {
	validate(req.body, function(err, obj) {
		if (err) { res.send(500, obj); }
		else {
			obj.id = req.params.id;
			alerts.updateAlert(obj, function(err) {
				if (err) { res.send(500, JSON.stringify(err)); }
				else { res.send(200, "Updated"); }
			});
		}
	});
	res.send('OK');
};

var del = function(req, res) {
	alerts.delAlert(req.params.id, function(err) {
		if (err) { 
			res.send(500, JSON.stringify(err));
		} else {
			res.send(200, "Deleted");
		}
	});
	res.send('OK');
};

exports.addRoutes = function(app) {
	app.get('/alerts', list);
	app.post('/alerts', create);
	app.get('/alerts/:id', read);
	app.put('/alerts/:id', update);
	app.delete('/alerts/:id', del);
};
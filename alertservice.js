var alerts = require('./models/alerts');

var connected = false;

//Grumble!  We have devices in the wild that don't constrain to defaults!
var deviceExceptions = {
	'a2971cceb73e8aba1077aeaeb64ba666e79b2588': {		//RTX
		Acceleration: {
			threshScale: 0.001,
			feedProp: false,
			feedVars: ['AccelX', 'AccelY', 'AccelZ']
		}
	},
	'2daac3fb26879b53cc78a525b4f656e69ef55647': {		//Android
		Acceleration: {
			threshScale: 1,
			feedProp: 'Acceleration',
			feedVars: ['x', 'y', 'z']
		}
	},
	'8dac20b5f617f99d7aa83158a26a81e75a0118c4': {		//iPhone
		Acceleration: {
			threshScale: 1,
			feedProp: 'Acceleration',
			feedVars: ['x', 'y', 'z']
		}
	}
};
var feedMap = {
	Acceleration: {
		threshScale: 1,
		feedProp: 'feed',
		feedVars: ['x', 'y', 'z']
	}
};

var retrieveOptions = function(row) {
	var opts = false;
	if ((row.resourceid in deviceExceptions) && 
		(row.feed in deviceExceptions[row.resourceid])) {
		opts = deviceExceptions[row.resourceid][row.feed];
	} else if (row.feed in feedMap) {
		opts = feedMap[row.feed];
	}  
	return opts;
};

var triggerAlert = function(row, data, feedVar) {
	console.log("*****"+feedVar+" in "+row.feed+" is over threshold, notifying "+row.smsnum);
};

var onmessage = function(message) {
	//console.log(message);
	var swarmid = message.from.swarm;
	var resourceid = message.from.resource;
	alerts.getBySwarm(swarmid, resourceid, function(err, rows) {
		if (err) { return console.log("WARN: unable to check alert ",err); }
		if (rows.length < 1) { return; }
		//console.log("Got potential alerts to check");
		for (var idx in rows) {
			var row = rows[idx];
			var opts = retrieveOptions(row);
			if (!opts) {
				return console.log("WARN: Could not configure the alert");
			}
			//console.log("Opts: ",opts);
			var data = {};
			//console.log(JSON.stringify(message.payload)+"-> do we have "+JSON.stringify(opts.feedProp));
			if (!opts.feedProp) {
				data = message.payload;
			} else if (opts.feedProp in message.payload){
				data = message.payload[opts.feedProp];
			} else {
				return;
			}
			console.log("Comparing "+JSON.stringify(data)+" to "+row.thresh);
			for (var jdx in opts.feedVars) {
				var feedVar = opts.feedVars[jdx];
				if (typeof(data) !== "object" || !(feedVar in data)){
					console.log("WARN: could not find "+feedVar+" in "+JSON.stringify(data));
					continue;
				}
				if (Math.abs(data[feedVar]) > row.thresh*opts.threshScale) {
					triggerAlert(row, data, feedVar);
				}	
			}
		}
	});
};

var onerror = function(error) {
	console.log(error);
};

var onconnect = function(err) {
	if (err){
		console.log('Error connecting to swarm: ',err);
	} else {
		console.log('Connected to swarm');
		connected = false;
	}
};

var onpresence = function(presence) {
	console.log(presence);
};

var ondisconnect = function() {
	console.log('Disconnected from swarm');
	connected = false;
};

exports.attach = function(swarm) {
	console.log("Launching AlertService");
	swarm.on('message', onmessage);
	swarm.on('error', onerror);
	swarm.on('connect', onconnect);
	swarm.on('presence', onpresence);
	swarm.on('disconnect', ondisconnect);
	swarm.connect();
};
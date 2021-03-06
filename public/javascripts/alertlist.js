var boardmap = {
	Prius: '8dac20b5f617f99d7aa83158a26a81e75a0118c4',		//iphone
	Mini: 'a2971cceb73e8aba1077aeaeb64ba666e79b2588',		//rtx
	rl78g14: '55acc001d002e95de4c0885320efd4d52f0da95a',	//rl78g14
	example: 'eb81af58239ac15f07f3643688069190145e852f',	//example
	F150: '2daac3fb26879b53cc78a525b4f656e69ef55647'		//android
};

function delItem(id) {
	console.log('removing '+id);
	$.ajax({
		url: './alerts/'+id,
		type: 'DELETE',
		success: function(result) {
			location.reload();
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert(jqXHR.responseText);
		}
	});
}

function addItem(obj) {
	if ($('input#resourceid').val().length != 40) {
		return alert("Please select a board.");
	}
	console.log('adding',obj);
	$.ajax({
		url: './alerts/',
		type: 'POST',
		data: obj,
		success: function(result) {
			location.reload();
		},
		error: function(jqXHR, textStatus, errorThrown){
			alert(jqXHR.responseText);
		}
	});
}

function createObj() {
	var newobj = {
		smsnum: $('input#smsnum').val(),
		swarmid: '7179acadcf2ebfe425459a21ead970484fefc017',
		resourceid: $('input#resourceid').val(),
		feed: $('input#feed').val(),
		thresh: $('input#thresh').val()
	};
	addItem(newobj);
}

function selectRes(board) {
	var resourceid = boardToResourceID(board);
	if (!resourceid) {
		$('input#resourceid').val('Invalid Board');
	} else {
		$('input#resourceid').val(resourceid);
	}
}

function boardToResourceID(board) {
	if (board in boardmap) {
		return boardmap[board];
	} else {
		return false;
	}
}

function resourceIDToBoard(resourceid) {
	for (var board in boardmap) {
		if (boardmap[board] === resourceid) {
			return board;
		}
	}
	return false;
}

$(document).ready(function() {
	var manualUpdater = function(message) {
		if ((message.from.resource === boardmap.Mini) &&
			("AccelX" in message.payload)){
			$('div#minichart').swarmChart('update', {
				x:message.payload.AccelX,
				y:message.payload.AccelY,
				z:message.payload.AccelZ}
			);
		} else if ((message.from.resource === boardmap.F150) &&
			("Acceleration" in message.payload) &&
			(message.payload.Acceleration != "No data")){
			$('div#f150chart').swarmChart('update', {
				x:message.payload.Acceleration.x,
				y:message.payload.Acceleration.y,
				z:message.payload.Acceleration.z}
			);
		} else if ((message.from.resource === boardmap.Prius) &&
			("Acceleration" in message.payload) &&
			(message.payload.Acceleration != "No data")){
			$('div#priuschart').swarmChart('update', {
				x:message.payload.Acceleration.x,
				y:message.payload.Acceleration.y,
				z:message.payload.Acceleration.z}
			);
		}
	};
	SWARM.connect({apikey: '7a849e6548dbd6f8034bb7cc1a37caa0b1a2654b',
					resource: '433aa8bf77197e0d169b4dcae5cd914f97f1a5dd',
					swarms: ['7179acadcf2ebfe425459a21ead970484fefc017'],
					onmessage: manualUpdater });
	$('div#f150chart').swarmChart({
		width: 300,
		height: 200,
		chart: {
				series: { shadowSize: 0 }, // drawing is faster without shadows
				grid: { color: "#FFF" },
				legend: { backgroundColor: "#5C5D60" },
				yaxis: { ticks: 0 }
			},
		swarm: SWARM,
		resource: '8dac20b5f617f99d7aa83158a26a81e75a0118c4',
		feed: 'Acceleration'
	});
	$('div#minichart').swarmChart({
		width: 300,
		height: 200,
		chart: {
				series: { shadowSize: 0 }, // drawing is faster without shadows
				grid: { color: "#FFF" },
				legend: { backgroundColor: "#5C5D60" },
				yaxis: { ticks: 0,
						min: -1500,
						max: 1500 }
			},
		swarm: SWARM,
		resource: 'a2971cceb73e8aba1077aeaeb64ba666e79b2588',
		feed: 'Acceleration',
		feedVars: ['x','y','z'],
		numaxes: 3
	});
	$('div#priuschart').swarmChart({
		width: 300,
		height: 200,
		swarm: SWARM,
		chart: {
				series: { shadowSize: 0 }, // drawing is faster without shadows
				grid: { color: "#FFF" },
				legend: { backgroundColor: "#5C5D60" },
				yaxis: { ticks: 0 }
			},
		resource: '2daac3fb26879b53cc78a525b4f656e69ef55647',
		feed: 'Acceleration'
	});
});
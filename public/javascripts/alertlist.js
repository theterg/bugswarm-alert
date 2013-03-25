var boardmap = {
	iphone: '8dac20b5f617f99d7aa83158a26a81e75a0118c4',
	rtx: '6158b37aa046cac429158412ff6c6e451894ae5a',
	rl78g14: '55acc001d002e95de4c0885320efd4d52f0da95a',
	example: 'eb81af58239ac15f07f3643688069190145e852f'
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
		swarmid: '156161a2b25b9d6d38b39e41d3c4ebabc59cb5c7',
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
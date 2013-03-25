function editItem(id) {
	console.log('editing '+id);
}

function delItem(id) {
	console.log('removing '+id);
	$.ajax({
		url: './alerts/'+id,
		type: 'DELETE',
		success: function(result) {
			console.log("result: ",result);
		}
	});
}

function addItem(obj) {
	console.log('adding',obj);
	$.ajax({
		url: './alerts/',
		type: 'POST',
		data: obj,
		success: function(result) {
			console.log("result: ",result);
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

function cancelEdit() {
	console.log('Cancel Edit');
}
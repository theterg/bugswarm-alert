var alertRoutes = require('./alerts');
var alerts = require('../models/alerts');
/*
 * GET home page.
 */
var boardmap = {
	iphone: '8dac20b5f617f99d7aa83158a26a81e75a0118c4',
	rtx: '6158b37aa046cac429158412ff6c6e451894ae5a',
	rl78g14: '55acc001d002e95de4c0885320efd4d52f0da95a',
	test: 'eb81af58239ac15f07f3643688069190145e852f'
};

function resourceIDToBoard(resourceid) {
	for (var board in boardmap) {
		if (boardmap[board] === resourceid) {
			return board;
		}
	}
	return resourceid.substring(32,40);
}

var index = function(req, res){
	alerts.getAll(function(err, rows) {
		if (err) {
			res.render('error', {
				reason: err
			});
		} else {
			for (var idx in rows) {
				rows[idx].board = resourceIDToBoard(rows[idx].resourceid);
			}
			res.render('index', { alerts: rows,
				alertstr: JSON.stringify(rows) });
		}
	});
};

exports.addRoutes = function(app) {
	app.get('/', index);
	alertRoutes.addRoutes(app);
}
var alertRoutes = require('./alerts');
var alerts = require('../models/alerts');
/*
 * GET home page.
 */
var boardmap = {
	Prius: '8dac20b5f617f99d7aa83158a26a81e75a0118c4',		//iphone
	Mini: 'a2971cceb73e8aba1077aeaeb64ba666e79b2588',		//rtx
	rl78g14: '55acc001d002e95de4c0885320efd4d52f0da95a',	//rl78g14
	example: 'eb81af58239ac15f07f3643688069190145e852f',	//example
	F150: '2daac3fb26879b53cc78a525b4f656e69ef55647'		//android
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

exports.boardmap = boardmap;
exports.resourceIDToBoard = resourceIDToBoard;
exports.addRoutes = function(app) {
	app.get('/', index);
	alertRoutes.addRoutes(app);
};
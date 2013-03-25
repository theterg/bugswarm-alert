var alertRoutes = require('./alerts');
var alerts = require('../models/alerts');
/*
 * GET home page.
 */

var index = function(req, res){
	alerts.getAll(function(err, rows) {
		if (err) {
			res.render('error', {
				reason: err
			});
		} else {
			res.render('index', { alerts: rows,
								alertstr: JSON.stringify(rows) });
		}
	});
};

exports.addRoutes = function(app) {
	app.get('/', index);
	alertRoutes.addRoutes(app);
}

/**
 * Module dependencies.
 */

process.env.NODE_ENV = 'production';

var express = require('express'),
	engine = require('ejs-locals'),
	routes = require('./routes'),
	http = require('http'),
	path = require('path'),
	config = require('./config'),
	SwarmConnection = require('bugswarm-prt').Swarm,
	AlertService = require('./alertservice');

var TwilioClient = require('twilio');

var app = express();

app.configure(function(){
	app.set('port', process.env.PORT || config.port);
	app.set('views', __dirname + '/views');
	app.engine('ejs', engine);
	app.set('view engine', 'ejs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('bugswarmcookiesecret'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

routes.addRoutes(app);

http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});

var twilio = new TwilioClient(config.twilio.sid,
							config.twilio.authToken);

var swarm = new SwarmConnection(config.swarm);
AlertService.attach(swarm, twilio);

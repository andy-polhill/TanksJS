var requirejs = require('requirejs')
,	express = require('express')
,	http = require('http')
,	package = require('../package.json')
,	jade = require('jade')
,	app = express()
,	server = http.createServer(app)
,	io = require('socket.io').listen(server, {'flash policy port': -1 })
,	static;

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.set('view options', { basedir: __dirname});

//AppFog Environment
io.configure('production', function(){
	console.log("production sockets config");
	io.set('transports', ['flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
	io.enable('browser client minification');  // send minified client
	io.enable('browser client etag');          // apply etag caching logic based on version number
	io.enable('browser client gzip');          // gzip the file
	io.disable('flash policy server');          // no websockets, so try flashsocket
	io.set('log level', 1);                    // reduce logging
});

io.configure('development', function(){
	console.log("development sockets config");
	io.set('log level', 2);
});

console.log("==== %s %s ====", package.name, package.version);

requirejs.config({
    baseUrl: __dirname + '/js',
    nodeRequire: require
});

app.use(express.static(__dirname));

server.listen(80);

requirejs(["GameController"], function(GameController) {
	GameController.start({
		'package': package,
		'app': app,
		'io': io
	});
});

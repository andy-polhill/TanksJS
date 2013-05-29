var requirejs = require('requirejs')
,	express = require('express')
,	http = require('http')
,	app = express()
,	server = http.createServer(app)
,	io = require('socket.io').listen(server)
,	static;

io.configure('production', function(){
	console.log("production sockets config");
	io.set('transports', ['htmlfile', 'xhr-polling', 'jsonp-polling']);
	io.enable('browser client minification');  // send minified client
	io.enable('browser client etag');          // apply etag caching logic based on version number
	io.enable('browser client gzip');          // gzip the file
	io.set('log level', 1);                    // reduce logging
	static = 'target';
});

io.configure('development', function(){
	console.log("development sockets config");
	io.set('log level', 2);
	static = 'public';
});

requirejs.config({
    baseUrl: __dirname + '/' + static + '/js',
    nodeRequire: require
});

app.use(express.static(static));

server.listen(80);

requirejs(["GameController"], function(GameController) {
	GameController.start({
		'app': app,
		'io': io
	});
});

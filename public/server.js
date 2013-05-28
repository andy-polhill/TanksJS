var requirejs = require('requirejs'),
	express = require('express'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server/*, { log: false }*/);

requirejs.config({
    baseUrl: __dirname + '/js',
    nodeRequire: require
});

io.configure('production', function(){
	console.log("production sockets config");
	io.set('transports', ['htmlfile', 'xhr-polling', 'jsonp-polling']);
	io.enable('browser client minification');  // send minified client
	io.enable('browser client etag');          // apply etag caching logic based on version number
	io.enable('browser client gzip');          // gzip the file
	io.set('log level', 1);                    // reduce logging
});

io.configure('development', function(){
	console.log("development sockets config");
	io.set('log level', 2);
});

server.listen(80);

app.use(express.static(__dirname));

requirejs(["GameController"], function(GameController) {
	GameController.start({
		'app': app,
		'io': io
	});
});

var requirejs = require('requirejs'),
	express = require('express'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server, { log: false });;



requirejs.config({
    baseUrl: __dirname + '/js',
    nodeRequire: require
});

//use these transports for appfog deployment.
//otherwise there is a long wait for failed socket request.
//TODO: use appfog global variables for this
//io.set('transports', ['htmlfile', 'xhr-polling', 'jsonp-polling']);
io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging

server.listen(80);

app.use(express.static(__dirname));

requirejs(["Game"], function(Game) {
	Game.start({'io':io});
});

app.get('/', function (req, res) {
	res.sendfile(__dirname + 'index.html');
});	

app.get('/tanks', function (req, res) {
	requirejs(["collection/TankCollection"], function(TankCollection) {
		//Send the list of available tanks
		res.send(new TankCollection().toJSON());
	});
});	

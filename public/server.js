var requirejs = require('requirejs'),
	express = require('express'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server, { log: false });

requirejs.config({
    baseUrl: __dirname + '/js',
    nodeRequire: require
});

//use these transports for appfog deployment.
//otherwise there is a long wait for failed socket request.
//io.set('transports', ['htmlfile', 'xhr-polling', 'jsonp-polling']);

server.listen(8080);

app.use(express.static(__dirname));

app.get('/', function (req, res) {
	res.sendfile(__dirname + 'index.html');
});	

requirejs(["Game"], function(Game) {
	//Start the game, pass socket as a reference
	Game.start({'io': io});	
});
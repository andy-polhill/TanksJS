var requirejs = require('requirejs'),
	express = require('express'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server, { log: false });

requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require
});

server.listen(8080);

app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

requirejs(["Game"], function(Game) {
	//Start the game, pass socket as a reference
	Game.start({'io': io});	
});



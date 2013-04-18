var express = require('express'),
	http = require('http'),
	Game = require('./Game'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server, { log: false });

server.listen(8081);

app.use(express.static(__dirname + '/'));

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

//Start the game, pass socket as a reference
Game.start({'io': io});	
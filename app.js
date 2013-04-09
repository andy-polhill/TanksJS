//TODO: This is all currently very crude

var express = require('express'),
	http = require('http'),
	Backbone = require('backbone'),
	TankModel = require('./model/TankModel'),
	TankCollection = require('./collection/TankCollection'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server);

var FRAME_RATE = 100;

server.listen(8080);
app.use(express.static(__dirname + '/'));
//app.use('node', express.static(__dirname + '/node_modules'));

var tankCollection = new TankCollection();

console.log('Listening on port 8080');

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
	
	var tank = new TankModel({}, {
		socket: socket,
		frameRate: FRAME_RATE
	});

	var frameInterval = setInterval(function(){
		socket.emit('frame', tank.toJSON());		
	}, FRAME_RATE)

});
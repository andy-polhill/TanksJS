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

	tankCollection.add(
		new TankModel({
			id: socket.id
		}, {
			socket: socket,
			frameRate: FRAME_RATE
		}
	));

	socket.on('move', function(move) {
		tankCollection.get(socket.id).move(move);
	});

	socket.on('rotate', function(rotate) {
		tankCollection.get(socket.id).rotate(rotate);
	});

	socket.on('disconnect', function() {
		console.log('disconnect:' + socket.id);
		console.log('remove: ' + tankCollection.get(socket.id));
		tankCollection.remove(tankCollection.get(socket.id));
	});

	var frameInterval = setInterval(function(){
		socket.emit('frame', tankCollection.toJSON());		
	}, FRAME_RATE)

});

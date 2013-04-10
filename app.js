//TODO: This is all currently very crude

var express = require('express'),
	http = require('http'),
	Backbone = require('backbone'),
	_ = require('underscore'),
	TankModel = require('./model/TankModel'),
	TankCollection = require('./collection/TankCollection'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server);


var FRAME_RATE = 50;

server.listen(8080);
app.use(express.static(__dirname + '/'));
//app.use('node', express.static(__dirname + '/node_modules'));

var tankCollection = new TankCollection();
var events = _.extend({}, Backbone.Events);

console.log('====TANKS STARTED=====');

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {

	tankCollection.add(
		new TankModel({
			'id': socket.id
		}, {
			'events': events
		}
	));

	socket.on('move', function(move) {
		tankCollection.get(socket.id).set('move', move);
	});

	socket.on('rotate', function(rotate) {
		tankCollection.get(socket.id).set('rotate', rotate);
	});

	socket.on('disconnect', function() {
		tankCollection.remove(tankCollection.get(socket.id));
	});

	var frameInterval = setInterval(function(){
		events.trigger("frame:advance");
		socket.emit('frame', tankCollection.toJSON());		
	}, FRAME_RATE)

});

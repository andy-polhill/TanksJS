//TODO: This is all currently very crude

var express = require('express'),
	http = require('http'),
	Backbone = require('backbone'),
	_ = require('underscore'),
	TankModel = require('./model/TankModel'),
	ElementCollection = require('./collection/ElementCollection'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server);


var FRAME_RATE = 30;

server.listen(8080);
app.use(express.static(__dirname + '/'));
//app.use('node', express.static(__dirname + '/node_modules'));

var elementCollection = new ElementCollection();
var events = _.extend({}, Backbone.Events);

console.log('====TANKS STARTED=====');

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {

	elementCollection.add(
		new TankModel({
			'id': socket.id,
			'type': 'tank' 
		}, {
			'events': events
		}
	));

	socket.on('move', function(move) {
		elementCollection.get(socket.id).set('move', move);
	});

	socket.on('rotate', function(rotate) {
		elementCollection.get(socket.id).set('rotate', rotate);
	});

	socket.on('shoot', function(shoot) {
		elementCollection.get(socket.id).shoot();
	});

	socket.on('disconnect', function() {
		elementCollection.remove(elementCollection.get(socket.id));
	});

	var frameInterval = setInterval(function(){
		events.trigger("frame:advance");
		socket.emit('frame', elementCollection.toJSON());
	}, FRAME_RATE)

});

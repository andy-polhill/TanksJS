//TODO: This is all currently very crude

var express = require('express'),
	http = require('http'),
	Backbone = require('backbone'),
	_ = require('underscore'),
	CollisionDetection = require('./utils/CollisionDetection'),
	TankModel = require('./model/TankModel'),
	BoundsModel = require('./model/BoundsModel'),
	ElementCollection = require('./collection/ElementCollection'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server, { log: false });


var FRAME_RATE = 20;

var elementCollection = new ElementCollection(),
	boundsModel = new BoundsModel(),
	events = _.extend({}, Backbone.Events);

server.listen(8080);
app.use(express.static(__dirname + '/'));
//app.use('node', express.static(__dirname + '/node_modules'));

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
		try {
			elementCollection.get(socket.id).set('move', move);
		} catch(e) {}
	});

	socket.on('rotate', function(rotate) {
		try {
			elementCollection.get(socket.id).set('rotate', rotate);
		} catch(e) {}
	});

	socket.on('shoot', function(shoot) {
		try {
			elementCollection.get(socket.id).shoot();
		} catch(e) {}
	});

	socket.on('disconnect', function() {
		elementCollection.remove(elementCollection.get(socket.id));
	});

	var frameInterval = setInterval(function(){
		events.trigger("frame:advance");
		_.each(elementCollection.models, function(model, idx, collection) {
			if(typeof model !== "undefined") { 	
				CollisionDetection.detect(model, collection);
			}
		});		
		CollisionDetection.detect(boundsModel, elementCollection.models, {invert:true});
		socket.emit('frame', elementCollection.toJSON());
	}, FRAME_RATE)

});
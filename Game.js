var _ = require('underscore'),
	Backbone = require('backbone'),
	CollisionDetection = require('./utils/CollisionDetection'),
	TankModel = require('./model/TankModel'),
	BoundsModel = require('./model/BoundsModel'),
	ElementCollection = require('./collection/ElementCollection'),
	define = require('amdefine')(module);

define(function(require) {
		
	var FRAME_RATE = 20,
		MAX_SOCKETS = 4;
		
	return {
	
		frame: function(){
	
			//trigger frame advance
			this.events.trigger("frame:advance");
			
			//look for collisions between objects
			_.each(this.collection.models, function(model, idx, collection) {
				if(typeof model !== "undefined") { 	
					CollisionDetection.detect(model, collection);
				}
			});		
			
			//look for collision with bounds
			CollisionDetection.detect(this.boundsModel, this.collection.models, {invert:true});
			
			//emit output to each socket
			_.each(_.values(this.sockets), function(socket){
				socket.emit('frame', this.collection.toJSON());	
			}, this);
			
		},
	
		addSocket: function(socket) {

			//horrible context reference FIXME;
			var self = this;

			this.sockets[socket.id] = socket;

			if(_.size(this.sockets) <= MAX_SOCKETS) {
		
				//spawn tank in random location
				//TODO: ensure the location is empty
				this.collection.add(
					new TankModel({
						'id': socket.id,
						'type': 'tank',
						'x': _.random(0, this.boundsModel.get('x')),
						'y': _.random(0, this.boundsModel.get('y')),
						'a': _.random(0, 360)
					}, {
						'events': this.events
					}
				));
	
				//set up user controls			
				socket.on('move', function(move) {
					try {
						self.collection.get(socket.id).set('move', move);
					} catch(e) {}
				});
			
				socket.on('rotate', function(rotate) {
					try {
						self.collection.get(socket.id).set('rotate', rotate);
					} catch(e) {}
				});
			
				socket.on('shoot', function(shoot) {
					try {
						self.collection.get(socket.id).shoot();
					} catch(e) {}
				});
			
				socket.on('disconnect', function() {
					//remove tank
					self.collection.remove(self.collection.get(socket.id));
					
					//remove socket to prevent emitting to ghost
					delete self.sockets[socket.id];
				});
			}
		},
	
		start: function(opts) {
			
			//horrid context hack FIXME;
			var self = this;
			
			this.io = opts.io;
			
			//master collection of all game elements
			this.collection = new ElementCollection();

			//bounds model determines game edges
			this.boundsModel = new BoundsModel();
		
			//events object handles frame advance
			this.events = _.extend({}, Backbone.Events);

			//sockets object
			this.sockets = {};
						
			//when a new socket is opened call add socket
			this.io.sockets.on('connection', function(){
				self.addSocket.apply(self, arguments);
			});
			
			//start game interval
			frameInterval = setInterval(function(){
				self.frame.apply(self);
			}, FRAME_RATE);
			
			console.log('====**COMMENCE WAR**=====');
		}
	}
});
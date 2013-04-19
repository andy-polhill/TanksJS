define([
	'underscore',
	'backbone',
	'utils/CollisionDetection',
	'model/BarrierModel',
	'model/TankModel',
	'model/BoundsModel',
	'collection/ElementCollection'
], function(
	_,
	Backbone,
	CollisionDetection,
	BarrierModel,
	TankModel,
	BoundsModel,
	ElementCollection ) {
		
	var FRAME_RATE = 20,
		MAX_PLAYERS = 4,
		BARRIERS = 7;
		
	return {
		
		frame: function(){
	
			//trigger frame advance
			this.events.trigger('frame:advance');

			//look for collisions between objects
			_.each(this.collection.models, function(model, idx, collection) {
				if(typeof model !== 'undefined') { 	
					CollisionDetection.detect(model, collection, {
						'callback': 'collide'
					});
				}
			});		
			
			//look for collision with bounds
			CollisionDetection.detect(this.boundsModel, this.collection.models, {
				'invert': true,
				'callback': 'collide'
			});
			
			//emit output to each socket
			_.each(_.values(this.sockets), function(socket){
				socket.emit('frame', this.collection.toJSON());
			}, this);
		},
		
		move: function(socket, move) {
			try {
				this.collection.get(socket.id).set('move', move);
			} catch(e) {}
		},

		rotate: function(socket, rotate) {
			try {
				this.collection.get(socket.id).set('rotate', rotate);
			} catch(e) {}
		},
	
		shoot: function(socket) {
			try {
				this.collection.get(socket.id).shoot();
			} catch(e) {}
		},	

		disconnect: function(socket) {
			//remove tank
			this.collection.remove(this.collection.get(socket.id));
			
			//remove socket to prevent emitting to ghost
			delete this.sockets[socket.id];
		},
	
		addBarriers: function() {
			
			//add barriers in a random location
			for(var i=0; i < BARRIERS; i++) {				
				var barrier = new BarrierModel({
					'id' : _.uniqueId()
				});
				
				//put the barrier in an empty location
				CollisionDetection.position(barrier, this.collection.models, this.boundsModel);
				this.collection.add(barrier);
			}
		},
	
		addSocket: function(socket) {

			//create a reference to the socket
			this.sockets[socket.id] = socket;

			//create a new tank if the max players hasn't been exceeded
			if(_.size(this.sockets) <= MAX_PLAYERS) {
		
				//spawn tank in random location
				var tank = new TankModel({
					'id': socket.id,
					'a': _.random(0, 360)
				}, {
					'events': this.events
				});
				
				CollisionDetection.position(tank, this.collection.models, this.boundsModel);
				
				//add it to the collection
				this.collection.add(tank);
	
				//set up user controls			
				socket.on('move', _.bind(this.move, this, socket));
				socket.on('rotate', _.bind(this.rotate, this, socket));
				socket.on('shoot', _.bind(this.shoot, this, socket));
				socket.on('disconnect', _.bind(this.disconnect, this, socket));
			}
		},
	
		start: function(opts) {
			
			this.io = opts.io;
			
			//master collection of all game elements
			this.collection = new ElementCollection();

			//bounds model determines game edges
			this.boundsModel = new BoundsModel();
		
			//events object handles frame advance
			this.events = _.extend({}, Backbone.Events);

			//sockets object
			this.sockets = {};

			//add barriers
			this.addBarriers();

			//when a new socket is opened call add socket
			this.io.sockets.on('connection', _.bind(this.addSocket, this));
			
			//start game interval
			frameInterval = setInterval(_.bind(this.frame, this), FRAME_RATE);
			
			console.log('====**COMMENCE WAR**=====');
		}
	}
});
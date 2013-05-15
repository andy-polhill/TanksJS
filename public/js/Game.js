define([
	'underscore',
	'backbone',
	'utils/CollisionDetection',
	'model/BarrierModel',
	'model/TankModel',
	'model/BoundsModel',
	'collection/ServerCollection'
], function(
	_,
	Backbone,
	CollisionDetection,
	BarrierModel,
	TankModel,
	BoundsModel,
	ServerCollection ) {
		
	var FRAME_RATE = 30,
		MAX_PLAYERS = 4,
		BARRIERS = 10;
		
	return {
		
		remove: function(model, collection, id){
			_.each(_.values(this.sockets), function(socket){
				socket.emit('remove', model.get('id'));
			}, this);		
		},
		
		frame: function(){
	
			try {
	
				//trigger frame advance
				this.collection.trigger('frame:advance');
	
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
	
				//get any changes since last frame
				var JSON = this.collection.changes();
				//only output if there have been some changes
	
				if(!_.isEmpty(JSON)) {
					//emit output to each socket
					_.each(_.values(this.sockets), function(socket){
						socket.emit('frame', JSON);
					}, this);
				}
				
			} catch(e) {
				//TODO: I would rather not have this as I would hope for no bugs!
				console.error(e);
			}
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
				}, {
					'collection' : this.collection
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
					'collection': this.collection
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
			
			//emit the full collection, after that changes only
			socket.emit('frame', this.collection.toJSON());
		},
	
		start: function(opts) {

			//some Backbone overrides to make it fit a bit nicer
			Backbone.Model.prototype.isNew = function() {
				if(typeof this._isNew === "undefined") {
					this._isNew = true;
				}
				return this._isNew;
			};

			//some Backbone overrides to make it fit a bit nicer
			Backbone.Model.prototype.sync = function() { /*no op*/ };
			
			this.io = opts.io;
			
			//master collection of all game elements
			this.collection = new ServerCollection();

			//bounds model determines game edges
			this.boundsModel = new BoundsModel();

			//sockets object
			this.sockets = {};

			//add barriers
			this.addBarriers();

			//when a new socket is opened call add socket
			this.io.sockets.on('connection', _.bind(this.addSocket, this));
			
			this.collection.on('remove', this.remove, this);
			
			//start game interval
			frameInterval = setInterval(_.bind(this.frame, this), FRAME_RATE);
			
			console.log('====**COMMENCE WAR**=====');
		}
	}
});
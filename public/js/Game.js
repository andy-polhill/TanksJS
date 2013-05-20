define([
	'underscore',
	'backbone',
	'utils/CollisionDetection',
	'utils/TankFactory',
	'model/BarrierModel',
	'model/TankModel',
	'model/LifeModel',
	'model/BoundsModel',
	'collection/ServerCollection'
], function(
	_,
	Backbone,
	CollisionDetection,
	TankFactory,
	BarrierModel,
	TankModel,
	LifeModel,
	BoundsModel,
	ServerCollection ) {
		
	var FRAME_RATE = 60, //frame rate in milliseconds
		MAX_PLAYERS = 4, //max number of allowed tanks
		BARRIERS = 10, //number of randomly place barriers
		LIFE_TOKEN = 600; //the higher the less frequent
		
	return {
		
		remove: function(model, collection, id){
			_.each(_.values(this.sockets), function(socket){
				socket.emit('remove', model.get('id'));
			}, this);		
		},
		
		frame: function(){
	
			try {

				//determine wether to randomly drop a health power up
				if(_.random(0, LIFE_TOKEN) == LIFE_TOKEN) {
					this.addLife();
				}
	
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
			} catch(e) {
				console.log(e);
			}
		},	

		disconnect: function(socket) {
			//remove tank
			this.collection.remove(this.collection.get(socket.id));
			
			//remove socket to prevent emitting to ghost
			delete this.sockets[socket.id];
		},
		
		addLife: function() {
		
			var life = new LifeModel({
				'id' : _.uniqueId()
			}, {
				'collection' : this.collection
			});
		
			//put the life in an empty location
			CollisionDetection.position(life, this.collection.models, this.boundsModel);
			this.collection.add(life);		
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
	
		addTank: function(socket, variant) {

			//create a new tank if the max players hasn't been exceeded
			if(_.size(this.sockets) <= MAX_PLAYERS) {
		
				//spawn tank in random location
				var tank = TankFactory.create(variant, {
					'id': socket.id,
					'a': _.random(0, 360)
				}, {
					'collection': this.collection
				});
				
				CollisionDetection.position(tank, this.collection.models, this.boundsModel);
				
				console.log(tank.get('fv'));
				
				//add it to the collection
				this.collection.add(tank);
	
				//set up user controls			
				socket.on('move', _.bind(this.move, this, socket));
				socket.on('rotate', _.bind(this.rotate, this, socket));
				socket.on('shoot', _.bind(this.shoot, this, socket));
				socket.on('disconnect', _.bind(this.disconnect, this, socket));
			}
		},
	
		addSocket: function(socket) {

			//create a reference to the socket
			this.sockets[socket.id] = socket;
			
			//emit the full collection, after that changes only
			socket.emit('frame', this.collection.toJSON());

			socket.on('new:tank', _.bind(this.addTank, this, socket))
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
define([
	'underscore',
	'backbone',
	'utils/CollisionDetection',
	'utils/TankFactory',
	'utils/QueueUtils',
	'model/BarrierModel',
	'model/TankModel',
	'model/LifeModel',
	'model/BoundsModel',
	'collection/ServerCollection'
], function(
	_, Backbone, CollisionDetection, TankFactory, QueueUtils, BarrierModel, TankModel, LifeModel, BoundsModel, ServerCollection ) {
		
	var FRAME_RATE = 60 //frame rate in milliseconds
	,	BARRIERS = 10 //number of randomly place barriers
	,	LIFE_TOKEN = 600; //the higher the less frequent
		
	return {
		
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
					//emit output to room
					this.io.sockets.in('tanks').emit('frame', JSON);
				}
				
			} catch(e) {
				//TODO: I would rather not have this as I would hope for no bugs!
				console.error(e);
			}
		},

		remove: function(model, collection, id){
			this.io.sockets.in('tanks').emit('remove', model.get('id'));
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

		move: function(socket, move) {
			socket.get('tank', function(err, tank){
				tank.set('move', move);
			});
		},

		rotate: function(socket, rotate) {
			socket.get('tank', function(err, tank){
				tank.set('rotate', rotate);
			});
		},
	
		shoot: function(socket) {
			console.log('shoot');
			socket.get('tank', function(err, tank){
				tank.shoot();
			});
		},
	
		removeTank: function(socket) {

			console.log('remove tank');

			//you loose, time to leave the game room
			socket.leave('tanks');

			//remove the tank if there is one
			this.collection.remove(this.collection.get(socket.id));

			socket.removeAllListeners('tank:move');
			socket.removeAllListeners('tank:rotate');
			socket.removeAllListeners('tank:shoot');
			//push this dude to the back of the queue
			debugger;
			
			console.log(this.io.sockets.manager.rooms[""]);
			
			//this.io.sockets.manager.rooms[""] = QueueUtils.pushToLast(this.io.sockets.manager.rooms[""], socket.id);

			//let everyone know about the queue change
			QueueUtils.updateQueue(this.io.sockets.clients());

			//let them know they have lost!
			socket.emit('game:over');
		},
	
		addTank: function(socket, variant) {

			if(QueueUtils.queueHasSpace(this.io.sockets.clients(), socket)) {

				console.log('add tank');
				
				//remove any existing tanks for this user
				//TODO: this is copied and pasted from remove tank
				if(this.collection.get(socket.id) != null) {
					console.log('remove existing tank');

					this.collection.remove(this.collection.get(socket.id));
		
					socket.removeAllListeners('tank:move');
					socket.removeAllListeners('tank:rotate');
					socket.removeAllListeners('tank:shoot');
				}
			
				//join the game room, there are enough spaces
				socket.join('tanks');
						
				//spawn tank in random location
				var tank = TankFactory.create(variant, {
					'id': socket.id,
					'a': _.random(0, 360)
				}, {
					'collection': this.collection
				}, socket);

				//set the tank as a property on the socket
				socket.set('tank', tank);
				
				//set up user controls
				socket.on('tank:move', _.bind(this.move, this, socket));
				socket.on('tank:rotate', _.bind(this.rotate, this, socket));
				socket.on('tank:shoot', _.bind(this.shoot, this, socket));
				
				//make sure the location is empty
				CollisionDetection.position(tank, this.collection.models, this.boundsModel);
								
				//remove any existing tanks with the same id
				this.collection.remove(this.collection.get(socket.id));

				//we need to do a few things when the tank is removed				
				tank.on('destroy', function() {
					this.removeTank(socket);
				}, this);
				
				//add it to the collection
				this.collection.add(tank);

				console.log(this.collection.toJSON())
					
				//emit the full collection first time round, after that changes only
				socket.emit('frame', this.collection.toJSON());
			}
		},

		disconnect: function(socket) {

			console.log('disconnect');
		
			//remove the tank if there is one
			this.collection.remove(this.collection.get(socket.id));

			//let everyone know about the queue change
			//however defer it until socket has actually been disconnected.
			_.defer(function(sockets) {
				QueueUtils.updateQueue(sockets.clients())
			}, this.io.sockets);
		},

		connect: function(socket) {

			console.log('connect');
		
			//two actions can occur at this stage, adding a tank
			socket.on('tank:add', _.bind(this.addTank, this, socket));
			
			//or leaving and closing socket
			socket.on('disconnect', _.bind(this.disconnect, this, socket));

			//let everyone know about the queue change
			QueueUtils.updateQueue(this.io.sockets.clients());
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

			//emit remove event when an item is removed from the collection
			this.collection.on('remove', this.remove, this);

			//bounds model determines game edges
			this.boundsModel = new BoundsModel();

			//add barriers
			this.addBarriers();

			//when a new socket is opened call add socket
			this.io.sockets.on('connection', _.bind(this.connect, this));
			
			//start game interval
			frameInterval = setInterval(_.bind(this.frame, this), FRAME_RATE);
			
			console.log('====**COMMENCE WAR**=====');
		}
	}
});
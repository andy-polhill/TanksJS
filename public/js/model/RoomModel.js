define([
	'underscore',
	'backbone',
	'utils/ElementFactory',
	'collection/ElementCollection'
], function(_, Backbone, ElementFactory, ElementCollection) {

	var RoomModel = Backbone.Model.extend({

		initialize: function(atts, opts) {
		
			this.io = opts.io;

			this.elements = new ElementCollection(null, opts, this.toJSON());

			//emit remove event when an item is removed from the collection
			this.elements.on('remove', this.removeElement, this);

			//create a queue name, based on the room name
			this.set('queueName', this.get('name') + "Queue");
		},

		defaults: {
		
			'frame': 0,
			'id': _.uniqueId(),
			'playerCount': 0,
			'queueCount': 0,
			'maxPlayers': 4,
			'barriers': 10,
			'lifeFreq': 1400
		},	

		join: function(socket, data) {

			//on disconnect, leave the game
			socket.on('disconnect', _.bind(this.disconnect, this, socket));

			//store the required tank variant
			socket.set('variant', data.variant);
		
			//have we exceeded max users for this room
			if(this.get('playerCount') >= this.get('maxPlayers')) {
				this.joinQueue(socket, data);
			} else {
				this.joinActive(socket, data);			
			}		
		},
		
		joinActive: function(socket, data) {

			try {

				var name = this.get('name')
				,	variant = (typeof data !== "undefined") ? data.variant : "large-tank";
	
				//socket get is async, hence the bound callback						
				socket.get('variant', _.bind(function(err, variant){
	
					//join socket queue
					socket.join(name);
		
					this.set('playerCount', _.size(this.io.sockets.clients(name)));
					
					//create and add a tank for them
					var tank = ElementFactory.create(
						variant, 
						{
							'id': socket.id,
							'a': _.random(0, 360)
						}, {
							'collection': this.elements,
							'socket': socket
						}
					);
		
					//if the tank gets destroyed, leave the queue
					tank.on('destroy', _.bind(this.leaveActive, this, socket));
		
					//add players tank
					this.elements.add([tank], {'detect': true});
					
					//emit the current game screen
					socket.emit('game:start', this.elements.toJSON());
	
				}, this));
			} catch(e) {
				console.error(e);
				socket.disconnect();
			}
		},

		joinQueue: function(socket, data) {

			var queueName = this.get('queueName');

			//Join the queue						
			socket.join(queueName);

			//update the queue count
			this.set('queueCount', _.size(this.io.sockets.clients(queueName)));
			
			//emit the change to everyone else in the queue
			this.emitQueue('queue:change', this.toJSON());
		},
		
		disconnect: function(socket) {
			if(_.contains(this.io.sockets.clients(this.get('name')), socket)) {
				//destroy the tank, this will in turn exit the queue
				if(_.isObject(this.elements.get(socket.id))) {
					this.elements.get(socket.id).destroy();
				}
			} else {
				//they must have been in the queue
				this.leaveQueue(socket);
			}
		},
		
		leaveQueue: function(socket) {
						
			var queueName = this.get('queueName');
						
			//remove socket from queue
			socket.leave(queueName);

			//update queue count
			this.set('queueCount', _.size(this.io.sockets.clients(queueName)));
			
			//let everyone else in the queue know that its getting shorter
			this.emitQueue('queue:change', this.toJSON());
		},
		
		leaveActive: function(socket) {
		
			var name = this.get('name');
		
			//remove socket from active list
			socket.leave(name);

			//update player count
			this.set('playerCount', _.size(this.io.sockets.clients(name)));
					
			//get the first person from the queue
			var upgradedSocket = this.io.sockets.clients(this.get('queueName'))[0];
			
			if(upgradedSocket) {
				//remove them from the queue
				this.leaveQueue(upgradedSocket);
				
				//promote them to an active player
				this.joinActive(upgradedSocket);
			}

			//if the user is still with us, let them know its game over
			socket.emit('game:over');
		},
		
		frame: function() {
			//only emit if there are players
			if(this.get('playerCount') > 0) {
			
				//get any data changes from that room
				var JSON = this.elements.frame();
				
				//only emit if there are changes
				if(JSON.length > 0) {						
					this.emit('game:frame', JSON);
				}
			}		
		},

		removeElement: function(model, collection, id) {
		
			this.emit('game:remove', model.get('id'));
		},
		
		emit: function(name, data) {

			this.io.sockets.in(this.get('name')).emit(name, data);
		},
		
		emitQueue: function(name, data) {

			var sockets = this.io.sockets.clients(this.get('queueName'));

			_.each(sockets, function(socket) {
				//find sockets location in queue and add to data (zero indexed)
				data.position = _.indexOf(sockets, socket) + 1;
				socket.emit('queue:change', data);
			});
		}
	});
	
	return RoomModel;
});

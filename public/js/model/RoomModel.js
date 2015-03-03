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
			this.elements.on('remove', this.removeElement, this);
			this.set('queueName', this.get('name') + "Queue");
		},

		defaults: {
			'frame': 0,
			'id': _.uniqueId(),
			'playerCount': 0,
			'queueCount': 0,
			'maxPlayers': 2,
			'barriers': 10,
			'lifeFreq': 1400
		},

		join: function(socket, data) {
			console.log('player joins');
			//on disconnect, leave the game
			socket.on('disconnect', _.bind(this.disconnect, this, socket));
			socket.variant = data.variant;
			//have we exceeded max users for this room
			if(this.get('playerCount') >= this.get('maxPlayers')) {
				this.joinQueue(socket, data);
			} else {
				this.joinActive(socket, data);
			}
		},

		joinActive: function(socket, data) {
			var name = this.get('name')
			,	variant = (typeof data !== "undefined") ? socket.variant : "large-tank";

			socket.join(name);
			this.set('playerCount', _.size(this.io.nsps['/'].adapter.rooms[name]));

			//create and add a tank for them
			var tank = ElementFactory.create(
				variant,
				{
					'id': socket.id,
					'a': _.random(0, 360) //random angle
				}, {
					'collection': this.elements,
					'socket': socket
				}
			);
			tank.on('destroy', _.bind(this.leaveActive, this, socket));
			this.elements.add([tank], {'detect': true});
			socket.emit('game:start', this.elements.toJSON());
		},

		joinQueue: function(socket, data) {
			var queueName = this.get('queueName')
			socket.join(queueName);
			var clients = this.io.nsps['/'].adapter.rooms[queueName];
			this.set('queueCount', Object.keys(clients).length);
			this.emitQueue('queue:change', this.toJSON());
		},

		disconnect: function(socket) {
			//if element exists remove it
			if(_.isObject(this.elements.get(socket.id))) {
				this.elements.get(socket.id).destroy();
			} else {
				//they must have been in the queue
				this.leaveQueue(socket);
			}
		},

		leaveQueue: function(socket) {
			var queueName = this.get('queueName');
			socket.leave(queueName);
			this.set('queueCount', _.size(this.io.nsps['/'].adapter.rooms[queueName]));
			this.emitQueue('queue:change', this.toJSON());
		},

		leaveActive: function(socket) {
			var name = this.get('name'),
					queueName = this.get('queueName'),
					clients = this.io.nsps['/'].adapter.rooms[name]
					queueClients = this.io.nsps['/'].adapter.rooms[queueName];

			socket.leave(name);
			this.set('playerCount', _.size(clients));

			if(queueClients) {//people are queuing
				var promotedClient = Object.keys(queueClients)[0],
						promotedSocket = this.io.sockets.connected[promotedClient];
				if(promotedSocket) {
					this.leaveQueue(promotedSocket);
					this.joinActive(promotedSocket	);
				}
			}
			socket.emit('game:over');
		},

		frame: function() {
			if(this.get('playerCount') > 0) {
				var JSON = this.elements.frame();
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
			var clients = this.io.nsps['/'].adapter.rooms[this.get('queueName')];
			if(clients) {
				_.each(Object.keys(clients), function(client) {
					var socket = this.io.sockets.connected[client];
					data.position = _.indexOf(Object.keys(clients), client) + 1;
					socket.emit('queue:change', data);
				}, this);
			}
		}
	});

	return RoomModel;
});

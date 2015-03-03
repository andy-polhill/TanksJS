define([
	'underscore',
	'backbone',
	'model/BoundsModel',
	'collection/TankCollection',
	'collection/RoomCollection',
	'model/RoomModel'
], function(
	_, Backbone, BoundsModel, TankCollection, RoomCollection, RoomModel) {

	var FRAME_RATE = 1000 / 30; //frame rate in milliseconds

	return {

		frame: function() {
			try {
				this.roomCollection.each( function(room) {
					room.frame();
				}, this);
			} catch(e) {
				console.error(e);
			}
		},

		join: function(socket, data) {
			var room = this.roomCollection.findWhere({'name': data.room});
			if(room) {
				room.join(socket, data);
			}
		},

		connect: function(socket) {
			socket.on('game:join', _.bind(this.join, this, socket));
		},

		getRooms: function(req, res) {
			res.send(this.roomCollection.toJSON());
		},

		getTanks: function(req, res) {
			res.send(this.tankCollection.toJSON());
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

			this.app = opts.app;
			this.io = opts.io;

			//bounds model determines game edges
			this.boundsModel = new BoundsModel();

			this.tankCollection = new TankCollection();
			this.roomCollection = new RoomCollection(null, {
				'io': this.io,
				'boundsModel': this.boundsModel
			});

			this.app.get('/', function (req, res) {
				res.render('index', opts.package);
			});

			this.app.get('/rooms', _.bind(this.getRooms, this));
			this.app.get('/tanks', _.bind(this.getTanks, this));

			this.io.sockets.on('connection', _.bind(this.connect, this));

			//start game loop
			frameInterval = setInterval(_.bind(this.frame, this), FRAME_RATE);
		}
	};
});

define([
	'jquery',
	'underscore',
	'backbone',
	'collection/ClientCollection',
	'view/GameView',
	'view/RoomListView',
	'view/TankListView'
],

//TODO: hook into navigate/route to remove duplication of disconnect

function($, _, Backbone, ClientCollection, GameView, RoomListView, TankListView ){

	var AppRouter = Backbone.Router.extend({

		routes: {
			'rooms/:room/tanks/:variant': 'play',
			'rooms/:room/tanks': 'tanks',
			'*path': 'rooms' //default
		},

		rooms: function() {

			if(typeof this.socket !== "undefined") {
				this.socket.disconnect();
			}

			if(typeof this.tanksListView !== "undefined") {
				this.tanksListView.remove();
			}

			this.rooms = new Backbone.Collection([], {
				url: '/rooms'
			});

			this.roomsListView = new RoomListView({
				'collection': this.rooms
			});

			$('#wrapper').html(this.roomsListView.render());
			this.rooms.fetch({reset: true});
		},

		tanks: function(room) {

			if(typeof this.socket !== "undefined") {
				this.socket.disconnect();
			}

			if(typeof this.roomsListView !== "undefined") {
				this.roomsListView.remove();
			}

			var tanks = new Backbone.Collection([], {
				url: '/tanks'
			});

			this.tankListView = new TankListView({
				'collection': tanks
			});

			$('#wrapper').html(this.tankListView.render());
			tanks.fetch({reset: true});
		},

		play: function(room, variant) {

			if(typeof this.socket !== "undefined") {
				this.socket.disconnect();
			}

			//create a connection
			this.socket = io();

			/*.connect('/', {
				'force new connection': true,
				'sync disconnect on unload' : true
			});*/

			//join the game
			this.socket.emit('game:join', {
				'room': room,
				'variant': variant
			});

			this.gameView = new GameView({
				'el': 'body',
				'collection': this.elements,
				'socket': this.socket
			});
		}
	});

	return AppRouter;
});

define([
	'jquery',
	'underscore',
	'backbone',
	'collection/ClientCollection',
	'view/GameView',
	'view/QueueView',
	'view/RoomListView',
	'view/TankListView'
], 

function($, _, Backbone, ClientCollection, GameView, QueueView, RoomListView, TankListView ){

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
	    
			if(typeof this.tankListView !== "undefined") {
				this.roomsListView.remove();
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

			//TODO: Disconnect the socket if the user re-routes - Read manual on how to do this!
			//create a connection
			this.socket = io.connect('/', {
				'force new connection': true
			});

			//join the game
			this.socket.emit('game:join', {
				'room': room,
				'variant': variant
			});

			this.elements = new ClientCollection();
			this.queueModel = new Backbone.Model();

			this.socket.on('game:start', $.proxy(this.elements._set, this.elements));			
			this.socket.on('game:frame', $.proxy(this.elements._set, this.elements));
			this.socket.on('game:remove', $.proxy(this.elements.remove, this.elements));
			this.socket.on('queue:change', $.proxy(this.queueModel.set, this.queueModel));

			this.socket.on('game:over', function(data) {
				Vents.trigger('game:over')
			});

	    	this.gameView = new GameView({
	    		'el': 'body',
	    		'collection': this.elements,
	    		'socket': this.socket
	    	});

	    	this.queueView = new QueueView({
	    		'el': '#queue',
	    		'model': this.queueModel
	    	});

			this.socket.on('game:start', $.proxy(this.queueView.remove, this.queueView));			
	    }	    
	});

	return AppRouter
});
// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'collection/ClientCollection',
	'view/GameView',
	'view/TanksListView'
], 

function($, _, Backbone, ClientCollection, GameView, TanksListView){

	 var AppRouter = Backbone.Router.extend({
	 
	    routes: {
	      'play/:variant': 'play',
	      '*path': 'tanks' //default
	    },
	    
	    tanks: function() {
	    
	    	var tanks = new Backbone.Collection([], {
	    		url: '/tanks'
	    	});
	    
	    	new TanksListView({
	    		'el': '#wrapper',
	    		'collection': tanks
	    	});

	    	tanks.fetch();
	    },
	    
	    play: function( variant ) {

			//TODO clean this up
			require(["io"], function(io) {
				
				this.socket = io.connect('/', {
					'force new connection': true
				});
				
				this.socket.emit('new:tank', variant);
				
			    var collection = new ClientCollection(null, {
			    	'socket' : this.socket
			    });
			    	
		    	new GameView({
		    		'el' : 'body',
		    		'socket' : this.socket,
		    		'collection' : collection
		    	});
	    	})
	    }    
	});

	return AppRouter
});
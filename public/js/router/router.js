// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'collection/ClientCollection',
	'view/GameView'
], 

function($, _, Backbone, ClientCollection, GameView){

	 var AppRouter = Backbone.Router.extend({
	 
	 	initialize: function(opts) {
	 		this.socket = opts.socket;	 	
	 	},
	 
	    routes: {
	      // Define some URL routes
	      '*path': 'play'
	    },
	    
	    play: function() {

	    	this.collection = new ClientCollection(null, {
	    		'socket' : this.socket
	    	});
	    	
	    	this.gameView = new GameView({
	    		'el' : 'body',
	    		'socket' : this.socket,
	    		'collection' : this.collection
	    	});	    	
	    }    
	});

	return AppRouter
});
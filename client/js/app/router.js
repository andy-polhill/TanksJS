// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'collection/ElementCollection',
	'view/GameView'
], 

function($, _, Backbone, ElementCollection, GameView){

	 var AppRouter = Backbone.Router.extend({
	 
	 	initialize: function(opts) {
	 		this.socket = opts.socket;	 	
	 	},
	 
	    routes: {
	      // Define some URL routes
	      '*path': 'play'
	    },
	    
	    play: function() {

	    	this.collection = new ElementCollection(null, {
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
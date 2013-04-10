// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'collection/TankCollection',
	'view/GameView'
], 

function($, _, Backbone, TankCollection, GameView){

	 var AppRouter = Backbone.Router.extend({
	 
	 	initialize: function(opts) {
	 		this.socket = opts.socket;	 	
	 	},
	 
	    routes: {
	      // Define some URL routes
	      '*path': 'play'
	    },
	    
	    play: function() {

	    	this.tankCollection = new TankCollection(null, {
	    		'socket' : this.socket
	    	});
	    	
	    	this.gameView = new GameView({
	    		'el' : 'body',
	    		'socket' : this.socket,
	    		'collection' : this.tankCollection
	    	});	    	
	    }    
	});

	return AppRouter
});
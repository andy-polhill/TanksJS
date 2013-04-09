// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'sockets.io'
	'view/TankView',
	'model/TankModel'
], 

function($, _, Backbone, socket, TankView, TankModel){

	 var AppRouter = Backbone.Router.extend({
	 
	 	initialize: function(opts) {
	 		this.socket = opts.socket;	 	
	 	}
	 
	    routes: {
	      // Define some URL routes
	      '*path': 'play'
	    },
	    
	    play: function() {
	    	var tankCollection = new TankCollection();
	    }    
	});

	return AppRouter
});
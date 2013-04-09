define([
	'jquery',
	'underscore',
	'backbone',
	'sockets.io'
], function($, _, Backbone){

	var TankModel = Backbone.Model.extend({
		initialize: function() {
			//TODO: fix this hardcoded host
			this.socket = io.connect('http://localhost/');
			this.on('change:move', this.move);
			this.on('change:rotate', this.rotate);
			this.socket.on('frame', $.proxy(this.frame, this));	
		},
		frame: function(data) {
			this.set(data);
		},
		move: function() {
			console.log("socket move: " + this.get('move'));
			this.socket.emit('move', this.get('move'));
		},
		rotate: function() {
			console.log("socket rotate: " + this.get('rotate'));
			this.socket.emit('rotate', this.get('rotate'));
		}
	});

	return TankModel;

});
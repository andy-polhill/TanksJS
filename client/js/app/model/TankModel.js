define([
	'jquery',
	'underscore',
	'backbone',
	'sockets.io'
], function($, _, Backbone){

	var TankModel = Backbone.Model.extend({
		initialize: function() {
			//TODO: this requires a domain
			this.socket = io.connect('http://localhost/');
			//this.socket = io.connect('http://10.11.11.250/');
			this.on('change:move', this.move);
			this.on('change:angle', this.angle);
			this.socket.on('frame', $.proxy(this.frame, this));	
		},
		frame: function(data) {
			this.set(data);
		},
		move: function() {
			this.socket.emit('move', this.get('move'));
		},
		angle: function() {
			this.socket.emit('angle', this.get('angle'));
		}
	});

	return TankModel;

});
define([
	'jquery',
	'underscore',
	'backbone',
	'sockets.io'
], function($, _, Backbone){

	var TankModel = Backbone.Model.extend({
		initialize: function() {
			this.socket = io.connect('http://localhost');
			this.on('change:move', this.sync);
			this.socket.on('frame', $.proxy(this.frame, this));	
		},
		frame: function(data) {
			this.set(data);
		},
		sync: function() {
			this.socket.emit('move', this.get('move'));
		}
	});

	return TankModel;

});
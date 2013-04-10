define([
	'jquery',
	'underscore',
	'backbone',
	'model/TankModel'
], function($, _, Backbone, TankModel){

	var TankCollection = Backbone.Collection.extend({
		initialize : function(atts, opts) {
			this.socket = opts.socket;
			this.socket.on('frame', $.proxy(this.frame, this));	
		},
		frame: function(data) {
			this.set(data);
		},
		model : TankModel
	});

	return TankCollection;

});
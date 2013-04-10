define([
	'jquery',
	'underscore',
	'backbone',
	'model/TankModel'
], function($, _, Backbone, TankModel){

	var TankCollection = Backbone.Collection.extend({
		initialize : function(atts, opts) {
			console.log('initialize collection');
			this.socket = opts.socket;
			this.socket.on('frame', $.proxy(this.frame, this));	
		},
		frame: function(data) {
			console.log(data);
			this.set(data);
		},
		model : TankModel
	});

	return TankCollection;

});
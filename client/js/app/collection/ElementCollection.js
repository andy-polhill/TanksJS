define([
	'jquery',
	'underscore',
	'backbone',
	'model/BulletModel',
	'model/TankModel'
], function($, _, Backbone, BulletModel, TankModel){

	var ElementCollection = Backbone.Collection.extend({
		initialize : function(atts, opts) {
			this.socket = opts.socket;
			this.socket.on('frame', $.proxy(this.frame, this));	
		},
		frame: function(data) {
			this.set(data);
		}
	});

	return ElementCollection;

});
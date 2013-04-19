define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	var ElementCollection = Backbone.Collection.extend({
		initialize : function(atts, opts) {
			this.socket = opts.socket;
			this.socket.on('frame', $.proxy(this.set, this));	
		}
	});

	return ElementCollection;

});
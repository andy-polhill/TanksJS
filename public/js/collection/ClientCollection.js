define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	var ClientCollection = Backbone.Collection.extend({
		initialize : function(atts, opts) {
			this.socket = opts.socket;
			this.socket.on('frame', $.proxy(this._set, this));
			this.socket.on('remove', $.proxy(this.remove, this));
		},
		_set: function(data) {
			//don't remove items, leave the _remove method to do this.
			this.set(data, {'remove' : false});
		}
	});

	return ClientCollection;

});
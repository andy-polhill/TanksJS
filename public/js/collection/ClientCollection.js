define([
	'underscore',
	'backbone'
], function(_, Backbone){

	var ClientCollection = Backbone.Collection.extend({
		
		_set: function(data) {
			//don't remove items, leave the _remove method to do this.
			this.set(data, {'remove' : false});
		}
	});

	return ClientCollection;

});
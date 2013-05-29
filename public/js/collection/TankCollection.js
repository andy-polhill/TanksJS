define([
	'underscore',
	'backbone',
	'utils/ElementFactory'
], function(_, Backbone, ElementFactory){

	var TankCollection = Backbone.Collection.extend({
	
		initialize : function() {
		
			this.add([
				ElementFactory.create('large-tank', {}, {collection: this}),
				ElementFactory.create('medium-tank', {}, {collection: this}),
				ElementFactory.create('small-tank', {}, {collection: this}),
				ElementFactory.create('special-tank', {}, {collection: this})
			]);
		}
	});

	return TankCollection;

});
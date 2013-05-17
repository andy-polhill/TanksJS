define([
	'underscore',
	'backbone'
], function(
	_, 
	Backbone) {

	var BoundsModel = Backbone.Model.extend({

		defaults: {
			'id': _.uniqueId(),
			'x': 0, //horizontal center
			'y': 0, //vertical center
			'w': 640, //width
			'h': 480, //height
			'type': 'bounds'
		}		
	});
	
	return BoundsModel;
});

define([
	'underscore',
	'backbone'
], function(
	_, 
	Backbone) {

	var BoundsModel = Backbone.Model.extend({

		defaults: {
			'id': _.uniqueId(),
			'x': 320, //horizontal center
			'y': 240, //vertical center
			'w': 640, //width
			'h': 480, //height
			'type': 'bounds'
		}		
	});
	
	return BoundsModel;
});

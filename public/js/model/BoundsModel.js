define([
	'underscore',
	'backbone',
	'model/ElementModel'
], function(
	_, Backbone, ElementModel) {

	var BoundsModel = ElementModel.extend({

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

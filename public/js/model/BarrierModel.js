define([
	'underscore',
	'backbone',
	'model/ElementModel'
], function(
	_, Backbone, ElementModel) {

	var BarrierModel = ElementModel.extend({

		defaults: {
			'x': 0, //horizontal
			'y': 0, //vertical
			'h': 50, //height
			'w': 50, //width
			'type': 'barrier'
		}
	});
	
	return BarrierModel;
});

var Backbone = require('backbone'),
	_ = require('underscore'),
	define = require('amdefine')(module);

define(function(require) {

	var BarrierModel = Backbone.Model.extend({

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

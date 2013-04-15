var Backbone = require('backbone'),
	_ = require('underscore'),
	define = require('amdefine')(module);

define(function(require) {

	var BoundsModel = Backbone.Model.extend({

		defaults: {
			'id': '1',
			'x': 0, //horizontal
			'y': 0, //vertical
			'h': -400, //height
			'w': -600, //width
			'type': 'bounds'
		},
		
		collide: function(){}
		
	});
	
	return BoundsModel;
});

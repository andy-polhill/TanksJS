var Backbone = require('backbone');

var TankServerModel = Backbone.Model.extend({
	initialize : function() {
		console.log('server tank model');
	},
	defaults : {
		'move' : false,
		'rotate' : null,
		'velocity' : 1.5,
		'position' : {
			'angle' : 0,
			'left' : 0,
			'top' : 0
		}
	}
});

exports.create = function(opts) {
	return new TankServerModel(opts);
};

define([
	'underscore',
	'backbone',
	'model/TankModel'
], function(_, Backbone, TankModel) {

	var MediumTankModel = TankModel.extend({
	
		defaults : {
			'w': 23,
			'h': 30,
			'fv': 1.6, //forward velocity
			'rv': 0.8, //reverse velocity
			'tc' : 2, //turning circle
			'variant': 'medium-tank',
			'maxLife': 90,
			'life': 90,
			'heat': 40, //heat
			'maxHeat': 40,
			'weapon': {
				'v': 8, //velocity
				'h': 3, //height
				'w': 3, //width
				'd': 5, //damage
				'type': 'bullet',
				'r': 280 //range
			}
		}
	});

	_.defaults(MediumTankModel.prototype.defaults, TankModel.prototype.defaults);

	return MediumTankModel;
});

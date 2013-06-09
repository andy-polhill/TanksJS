define([
	'underscore',
	'backbone',
	'model/TankModel'
], function(_, Backbone, TankModel) {

	var MediumTankModel = TankModel.extend({
	
		defaults : {
			'w': 23,
			'h': 30,
			'fv': 2.8, //forward velocity
			'rv': 1.6, //reverse velocity
			'variant': 'medium-tank',
			'maxLife': 90,
			'life': 90,
			'heat': 40, //heat
			'maxHeat': 40,
			'weapon': {
				'v': 12, //velocity
				'h': 3, //height
				'w': 3, //width
				'd': 5, //damage
				'type': 'bullet',
				'r': 300 //range
			}
		}
	});

	_.defaults(MediumTankModel.prototype.defaults, TankModel.prototype.defaults);

	return MediumTankModel;
});

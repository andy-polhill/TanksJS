define([
	'underscore',
	'backbone',
	'model/TankModel'
], function(_, Backbone, TankModel) {

	var SmallTankModel = TankModel.extend({
	
		defaults : {
			'w': 25,
			'h': 24,
			'tc' : 6, //turning circle
			'fv': 1.9, //forward velocity
			'rv': 1, //reverse velocity
			'variant': 'small-tank',
			'maxLife': 80,
			'life': 80,
			'heat': 50, //heat
			'maxHeat': 50,
			'weapon': {
				'v': 6, //velocity
				'h': 2, //height
				'w': 2, //width
				'd': 4, //damage
				'type': 'bullet',
				'r': 250 //range
			}
		}
	});

	_.defaults(SmallTankModel.prototype.defaults, TankModel.prototype.defaults);

	return SmallTankModel;
});

define([
	'underscore',
	'backbone',
	'model/TankModel'
], function(
	_, 
	Backbone,
	TankModel) {

	var SmallTankModel = TankModel.extend({
		defaults : {
			'fv': 1.8, //forward velocity
			'rv': 1, //reverse velocity
		}
	});

	_.defaults(SmallTankModel.prototype.defaults, TankModel.prototype.defaults);

	return SmallTankModel;
});

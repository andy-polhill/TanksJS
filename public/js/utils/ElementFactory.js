define([
	'underscore', 
	'model/TankModel',
	'model/SmallTankModel',
	'model/MediumTankModel',
	'model/SpecialTankModel',
	'model/BarrierModel',
	'model/LifeModel'
	],

	function( _, TankModel, SmallTankModel, MediumTankModel, SpecialTankModel, BarrierModel, LifeModel ) {

	var elements = {
		'large-tank': TankModel,
		'small-tank': SmallTankModel,
		'medium-tank': MediumTankModel,
		'special-tank': SpecialTankModel,
		'barrier': BarrierModel,
		'life': LifeModel
	};
		
	return {
		
		create: function(element, attributes, options, socket) {

			var model = new elements[element](attributes, options);
			
			return model;
		}
	}
});

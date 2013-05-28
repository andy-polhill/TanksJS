define([
	'underscore', 
	'model/TankModel',
	'model/SmallTankModel',
	'model/MediumTankModel',
	'model/SpecialTankModel'
	],

	function( _, TankModel, SmallTankModel, MediumTankModel, SpecialTankModel ) {

	var variants = {
		'large-tank': TankModel,
		'small-tank': SmallTankModel,
		'medium-tank': MediumTankModel,
		'special-tank': SpecialTankModel
	};
		
	return {
		
		create: function(variant, attributes, options, socket) {

			var tank = new variants[variant](attributes, options);
			
			return tank;
		}		
	}
});

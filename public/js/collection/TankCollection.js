define([
	'underscore',
	'backbone',
	'model/TankModel',
	'model/SmallTankModel',
	'model/MediumTankModel',
	'model/SpecialTankModel'
], function(_, Backbone, TankModel, SmallTankModel, MediumTankModel, SpecialTankModel){

	var TankCollection = Backbone.Collection.extend({
		initialize : function() {
			this.add(new TankModel({}, {
				collection : this 
			}));
			this.add(new SmallTankModel({}, {
				collection : this 
			}));
			this.add(new MediumTankModel({}, {
				collection : this 
			}));
			this.add(new SpecialTankModel({}, {
				collection : this 
			}));
		}
	});

	return TankCollection;

});
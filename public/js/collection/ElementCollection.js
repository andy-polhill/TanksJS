define([
	'underscore',
	'backbone',
	'model/BulletModel',
	'model/TankModel',
	'model/BarrierModel'
], function(
	_, 
	Backbone,
	BulletModel,
	TankModel,
	BarrierModel) {
	
	var ElementCollection = Backbone.Collection.extend({
		model : function(atts, opts) {
			switch(opts.type) {
				case 'bullet':
					return new BulletModel(atts, opts);
				case 'tank':
					return new TankModel(atts, opts);
				case 'barrier':
					return new BarrierModel(atts, opts);
			}
		}
	});
	
	return ElementCollection;
});

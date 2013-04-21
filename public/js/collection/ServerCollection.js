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
	
	var ServerCollection = Backbone.Collection.extend({
		model : function(atts, opts) {
			switch(opts.type) {
				case 'bullet':
					return new BulletModel(atts, opts);
				case 'tank':
					return new TankModel(atts, opts);
				case 'barrier':
					return new BarrierModel(atts, opts);
			}
		},
		changes: function() {
			var JSON = [];
			_.each(this.models, function(model) {
				if(model.isNew()) {
					JSON.push(model.toJSON());
				} else {
					var obj = {id: model.get('id')};
					if(model.hasChanged()) {
						console.log('changed');
						_.extend(obj, model.changedAttributes());
					}
					JSON.push(obj);
				}
			});
			return JSON;
		}
	});
	
	return ServerCollection;
});

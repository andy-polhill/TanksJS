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
			//to speed things up a bit we should only publish changes
			_.each(this.models, function(model) {
				if(model.isNew()) {
					model._isNew = false;
					//if its a new model publish the whole thing
					JSON.push(model.toJSON());
				} else if(model.hasChanged()) {
					//create delta changes for object
					var obj = {'id':model.get('id')};
					_.extend(obj, model.changedAttributes());
					JSON.push(obj);
				}
			});
			return JSON;
		}
	});
	
	return ServerCollection;
});

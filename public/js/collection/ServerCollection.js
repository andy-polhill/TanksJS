define([
	'underscore',
	'backbone',
	'model/BulletModel',
	'model/TankModel',
	'model/BarrierModel',
	'model/LifeModel'
], function(
	_, 
	Backbone,
	BulletModel,
	TankModel,
	BarrierModel,
	ExplosionModel,
	LifeModel) {
	
	var ServerCollection = Backbone.Collection.extend({
		model : function(atts, opts) {
			switch(opts.type) {
				case 'bullet':
					return new BulletModel(atts, opts);
				case 'tank':
					return new TankModel(atts, opts);
				case 'barrier':
					return new BarrierModel(atts, opts);
				case 'explosion':
					return new ExplosionModel(atts, opts);
				case 'life':
					return new LifeModel(atts, opts);
			}
		},
		changes: function() {
			var JSON = [];
			//to speed things up a bit we should only publish changes
			_.each(this.models, function(model) {
				if(model.isNew()) {
					model._isNew = false;
					//if its a new model publish the whole thing
					//TODO: Currently we send stuff to the front end which isn't required
					//look to extend toJSON() and make some atts 'private' (i.e. server only)
					JSON.push(model.toJSON());
				} else if(model.hasChanged()) {
					//create delta changes for object
					var obj = {'id':model.get('id')};
					_.extend(obj, model.changedAttributes());
					JSON.push(obj);
				}
			});
			
			console.log(JSON);
			
			return JSON;
		}
	});
	
	return ServerCollection;
});

define([
	'underscore',
	'backbone',
	'utils/CollisionDetection',
	'utils/ElementFactory',
	'model/BulletModel',
	'model/TankModel',
	'model/BarrierModel',
	'model/LifeModel'
], function( _, Backbone, CollisionDetection, ElementFactory, BulletModel, TankModel, BarrierModel, ExplosionModel, LifeModel) {
	
	var LIFE_TOKEN = 500;
	
	var ElementCollection = Backbone.Collection.extend({
	
		initialize: function(atts, opts) {
			this.boundsModel = opts.boundsModel;

			//Add barriers
			for(var i=0; i < 10; i++) {
				this.add([
					ElementFactory.create('barrier', {'id': _.uniqueId()} )
				], {'detect': true});
			}
		},
	
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
		
		add: function(models, opts) {
			if(typeof opts !== "undefined" && opts.detect) {
				_.each(models, function(model) {
					//put the element in an empty location
					CollisionDetection.position(model, this.models, this.boundsModel);
				}, this);
			}
			Backbone.Collection.prototype.add.call(this, models, opts);
		},
		
		frame: function() {
			
			//TODO: Dirtbags clean up!
			//FIXME: Quicker Quicker Quicker Quicker!!!

			//determine wether to randomly drop a health power up
			if(_.random(0, LIFE_TOKEN) == LIFE_TOKEN) {
				this.add([
					ElementFactory.create('life', {'id': _.uniqueId()} )
				], {'detect': true});
			}

			//trigger frame davance, all elements will respond to this.
			//TODO: The event might be a bit pointless, just calling the relevant method might be simpler
			_.each(this.models, function(model) {
				model.frame();
			});

			//TODO: There are definitely some efficiency changes to do in CollisionDetection

			//look for collisions between objects
			_.each(this.models, function(model, idx, collection) {
				if(typeof model !== 'undefined') {
					CollisionDetection.detect(model, collection, {
						'callback': 'collide'
					});
				}
			});

			//look for collision with bounds
			CollisionDetection.detect(this.boundsModel, this.models, {
				'invert': true,
				'callback': 'collide'
			});

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
					var obj = {'id': model.get('id')};
					_.extend(obj, model.changedAttributes());
					JSON.push(obj);
				}
			});
			

			//console.log(JSON);
			
			return JSON;
		}
	});
	
	return ElementCollection;
});

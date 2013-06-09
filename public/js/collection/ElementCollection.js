define([
	'underscore',
	'backbone',
	'utils/CollisionDetection',
	'utils/ElementFactory'
], function( _, Backbone, CollisionDetection, ElementFactory) {
	
	var LIFE_TOKEN = 700;
	
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
			return ElementFactory.create(opts.type, atts, opts);
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
		
		remove: function(model) {

			var type = model.get('type');

			//Every element that is removed, is followed by an explosion BLAMMO!
			//(except for bullets and explosions)
			if(!type.match(/bullet|explosion|life/g)) {
				this.add([
					ElementFactory.create('explosion', {
						'y': model.get('y') + (model.get('w') / 2),
						'x': model.get('x') + (model.get('h') / 2),
						'id': _.uniqueId()
					})
				]);
			}

			//if it was a Barrier add a new one
			if(type === 'barrier') {
				this.add([
					ElementFactory.create('barrier', {'id': _.uniqueId()} )
				], {'detect': true});			
			}

			Backbone.Collection.prototype.remove.apply(this, arguments);		
		},
		
		frame: function() {
			
			//TODO: Look for optimisation possibilities
			
			//determine wether to randomly drop a health power up
			if(_.random(0, LIFE_TOKEN) == LIFE_TOKEN) {
				this.add([
					ElementFactory.create('life', {'id': _.uniqueId()} )
				], {'detect': true});
			}

			//call frame method on each element
			_.each(this.models, function(model) {
				model.frame();
			});

			//look for collisions between objects
			_.each(this.models, function(model, idx, collection) {
				CollisionDetection.detect(model, collection, {
					'callback' : 'collide'
				});
			});

			//look for collision with bounds
			CollisionDetection.detect(this.boundsModel, this.models, {
				'invert': true,
				'callback' : 'collide'
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
			
			return JSON;
		}
	});
	
	return ElementCollection;
});

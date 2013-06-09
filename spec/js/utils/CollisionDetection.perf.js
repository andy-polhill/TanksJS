define([
	'underscore',
	'backbone',
	'collection/ElementCollection',
	'utils/ElementFactory',
	'model/BoundsModel'
], function(
	_, Backbone, ElementCollection, ElementFactory, BoundsModel) {

	describe("Collision Detection Performance", function() {	
	    	
	    it('performance test of frame', function() {

			//some Backbone overrides to make it fit a bit nicer
			Backbone.Model.prototype.isNew = function() {
				if(typeof this._isNew === "undefined") {
					this._isNew = true;
				}
				return this._isNew;
			};

			//some Backbone overrides to make it fit a bit nicer
			Backbone.Model.prototype.sync = function() { /*no op*/ };
	    
	    	var collection = new ElementCollection(null, {
	    		'boundsModel' : new BoundsModel()
	    	});

			var tank1 = ElementFactory.create(
				'large-tank', { 'id': 100 }, { 'collection': collection }
			);

			tank1.move(true);
			tank1.rotate(true);

			var tank2 = ElementFactory.create(
				'small-tank', { 'id': 100 }, { 'collection': collection }
			);

			tank2.move(true);
			tank2.shoot();

			var tank3 = ElementFactory.create(
				'medium-tank', { 'id': 100 }, { 'collection': collection }
			)

			tank3.move(true);
			tank3.shoot();
	    
	    	collection.add([tank1, tank2, tank3]);
	    	
	    	var count = 100000;

			start = new Date();

			for(var i=0; i < count; i++) {
				collection.frame();
			}

			end = new Date();
			
			console.log("TIME TO RUN:" + (end - start));
	    
	    });
	});
});
define([
	'underscore',
	'backbone',
	'model/TankModel',
	'model/BoundsModel',
	'utils/CollisionDetection'
], function(
	_, 
	Backbone,
	TankModel,
	BoundsModel,
	CollisionDetection) {

	describe("Collision Detection Performance", function() {	
	    	
	    it('performance test', function() {

			//1st run 264 milliseconds

			var count = 1;

			//create a tank
			var tank1 = new TankModel({
				'id':1,
				'x':0,
				'y':0,
				'w':10,
				'h':10
			}, {
				collection: {on:function(){}}
			});

			//create another tank that overlaps it
			var tank2 = new TankModel({
				'id':2,
				'x':5,
				'y':5,
				'w':10,
				'h':10
			}, {
				collection: {on:function(){}}
			});

			var start = new Date();

			for(var i=0; i < count; i++) {
				CollisionDetection.detect(tank2, [tank1], {
					'callback': 'collide'
				});
			}

			var end = new Date();

			console.log(end - start);

		});
	});
});
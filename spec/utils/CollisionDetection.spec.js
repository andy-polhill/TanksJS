TankModel = require('../model/TankModel'),
CollisionDetection = require('../util/CollisionDetection'),
Backbone = require('Backbone');

describe("Collision Detection", function() {	
    
    describe("bounds", function() {

	    it('should detect bounds collision', function() {
			//increment bullet count
			var tankModel = new TankModel({}, {
				events: {on:function(){}},
				collection: new Backbone.Collection()
			});
		})
    });    
});
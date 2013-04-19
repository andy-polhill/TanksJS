define([
	'underscore',
	'backbone',
	'model/BulletModel'
], function(
	_, 
	Backbone,
	BulletModel) {

	describe("Tank Model", function() {
		
	    it('should instantiate without throwing an error', function() {
			expect(function(){
				var tankModel = new TankModel({}, {events:{on:function(){}}});		
			}).not.toThrow();
	    }); 
	    
	    describe("shooting", function() {
	
		    /*it('should increment bullet count', function() {
				//increment bullet count
				var tankModel = new TankModel({}, {
					events: {on:function(){}},
					collection: new Backbone.Collection()
				});
	
				var initialCount = tankModel.get('bulletCount');
				tankModel.shoot();
				var secondaryCount = tankModel.get('bulletCount');			
				expect(secondaryCount - initialCount).toEqual(1);		
			})*/
	
		    it('should fire bullets from the correct location', function() {
	
				var collection = new Backbone.Collection(); 
	
				var tankModel = new TankModel({
					id:'1',
					width:10,
					height:10,
					top:0,
					left:0,
					angle:0
				}, {
					events: {on:function(){}},
					collection: collection
				});
	
				tankModel.shoot();
				var bullet = collection.get('1:1');
				console.log("**************")
				
				tankModel.set('angle', 90);
				tankModel.shoot();
				
				console.log("**************")
				//console.log(bullet.toJSON())
				//expect(bullet.get('top')).toEqual(5);
				//expect(bullet.get('left')).toEqual(-5);
		    });
	    }); 
	});
});
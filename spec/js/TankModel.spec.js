define([
	'underscore',
	'backbone',
	'model/TankModel'
], function(
	_, 
	Backbone,
	TankModel) {

	describe("Tank Model", function() {
		
	    it('should instantiate without throwing an error', function() {
			expect(function(){
				var tankModel = new TankModel({}, {collection:{on:function(){}}});		
			}).not.toThrow();
	    }); 
	});
});
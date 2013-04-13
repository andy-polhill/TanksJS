TankModel = require('../model/TankModel'),

describe("Tank Model", function() {
	
    it('should instantiate without throwing an error', function() {
		expect(function(){
			var tankModel = new TankModel({}, {events:{on:function(){}}});		
		}).not.toThrow();
    }); 
    
    describe("Bullet Creation", function() {

	    it('should fire bullets from the correct location', function() {
	    
	    });
    });
    
});
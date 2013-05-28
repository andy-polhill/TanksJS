define([
	'underscore',
	'backbone',
	'utils/QueueUtils'
], function(
	_, Backbone, QueueUtils) {

	describe("Queue Utils", function() {	
	    
	    describe("pushToLast", function() {

		    it('should push the selected socket to the end', function() {
		
				//bit hard to mock out the clients object on this
				var clients = QueueUtils.pushToLast([1, 2, 3, 4], 2);

				expect(clients).toEqual([1, 3, 4, 2]);
					
				var last = clients.pop();
	
				expect(last).toBe(2);
			});
	    });    
	});
});
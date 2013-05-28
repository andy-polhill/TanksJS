define(['backbone'], function(Backbone) {

	//TODO: rename to AbstractElementModel
	var ElementModel = Backbone.Model.extend({

		frame: function() {
			// No op - Implement frame animation here.
		},
		collide: function() {
			// No op - Implement collision logic here.
		}
	});
	
	return ElementModel;
});

define([
	'underscore',
	'backbone',
	'model/ElementModel'
], function(_,  Backbone, ElementModel) {

	var ExplosionModel = ElementModel.extend({

		initialize: function() {

			this.duration = 40;
		},
		
		defaults : {
			'x': 0, //horizontal
			'y': 0, //vertical
			'w': 26, //width
			'h': 26, //height
			'type': 'explosion',
		},
		
		frame: function() {
			
			this.duration--;
			if(this.duration <= 0) {
				this.collection.off('frame:advance', this.frame, this);
				this.destroy();
			}			
		}
	});
	
	return ExplosionModel;
});

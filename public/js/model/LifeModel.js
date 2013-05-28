define([
	'underscore',
	'backbone',
	'model/ElementModel'
], function(
	_, Backbone, ElementModel) {

	var LifeModel = ElementModel.extend({

		defaults: {
			'h': 16, //height
			'w': 16, //width
			'life': 50,
			'duration': 400, //shelf life
			'type': 'life'
		},
		frame: function() {
			var duration = this.get('duration') - 1;
			if(duration < 0) {
				this.collide();
			} else {
				this.set('duration', duration);
			}
		},
		collide: function() {
			this.destroy();		
		}
	});
	
	return LifeModel;
});

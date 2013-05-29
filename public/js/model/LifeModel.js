define([
	'underscore',
	'backbone',
	'model/ElementModel'
], function(_, Backbone, ElementModel) {

	var LifeModel = ElementModel.extend({

		initialize: function() {
			//define internal properties
			this._duration = 400; //shelf life
		},
		
		defaults: {
			'h': 16, //height
			'w': 16, //width
			'life': 50,
			'type': 'life'
		},
		
		frame: function() {
		
			this._duration--;
			if(this._duration < 0) {
				this.collide();
			}
		},
		
		collide: function() {
		
			this.destroy();		
		}
	});
	
	return LifeModel;
});

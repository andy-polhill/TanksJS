define([
	'underscore',
	'backbone'
], function(
	_, 
	Backbone) {

	var LifeModel = Backbone.Model.extend({

		initialize: function( atts, opts ) {		
			//listen to global frame advance
			this.collection.on('frame:advance', this.frame, this);
		},
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
			this.collection.off('frame:advance', this.frame, this);
			this.destroy();		
		}
	});
	
	return LifeModel;
});

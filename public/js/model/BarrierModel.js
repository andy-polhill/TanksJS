define([
	'underscore',
	'backbone',
	'model/ElementModel'
], function(
	_, Backbone, ElementModel) {

	var BarrierModel = ElementModel.extend({

		defaults: {
			'x': 0, //horizontal
			'y': 0, //vertical
			'h': 40, //height
			'w': 40, //width
			'type': 'barrier',
			'life': 60
		},
		
		collide: function(model) {
		
			var type = model.get('type');

			switch(type) {
				case "bullet":
					//life = life - damage
					life = this.get('life') - model.get('d');

					if(life < 0) {
						this.destroy();
					} else {
						this.set('life', life);
					}
				break;
				default: break;
			}
		}
	});
	
	return BarrierModel;
});

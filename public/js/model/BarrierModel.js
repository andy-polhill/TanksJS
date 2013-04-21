define([
	'underscore',
	'backbone'
], function(
	_, 
	Backbone) {

	var BarrierModel = Backbone.Model.extend({

		defaults: {
			'x': 0, //horizontal
			'y': 0, //vertical
			'h': 50, //height
			'w': 50, //width
			'type': 'barrier'
		},
		//TODO: tidy this method up, it is widely re-used
		isNew: function() {
			if(typeof this._isNew === "undefined") {
				this._isNew = false;
				return true;
			} else {
				return false;
			}
		}
	});
	
	return BarrierModel;
});

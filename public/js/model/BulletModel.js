define([
	'underscore',
	'backbone'
], function(
	_, 
	Backbone) {

	var BulletModel = Backbone.Model.extend({

		initialize: function( atts, opts ) {			
			//listen to global frame advance
			opts.events.on('frame:advance', this.frame, this);

			//calculate horizontal and vertical velocity
			//these will remane the same for the Bullet.
			var radians = this.get('a') * (Math.PI / 180),
				cos = Math.cos(radians),
				sin = Math.sin(radians);

			this.set('xv', this.get('v') * cos); //horizontal (x) velocity
			this.set('yv', this.get('v') * sin); //vertical (y) velocity
		},
		defaults : {
			'v': 4, //velocity
			'a': 0, //angle
			'x': 0, //horizontal
			'y': 0, //vertical
			'h': 3, //height
			'w': 3, //width
			'type': 'bullet'
		},
		frame: function() {
			//calculate the new location
			var left = this.get('x') - this.get('xv');
			var top = this.get('y') - this.get('yv');
			
			//set it on the model
			this.set({
				'x': parseFloat((left).toFixed(0)),
				'y': parseFloat((top).toFixed(0))
			});
		},
		sync:function(){},
		//TODO: tidy this method up, it is widely re-used
		isNew: function() {
			if(typeof this._isNew === "undefined") {
				this._isNew = false;
				return true;
			} else {
				return false;
			}
		},
		collide: function() {
			//bullet detonates no matter what it hits
			this.destroy();
		}
		
	});
	
	return BulletModel;
});

define([
	'underscore',
	'backbone',
	'model/ElementModel'
], function(_, Backbone, ElementModel) {

	var BulletModel = ElementModel.extend({

		initialize: function( atts, opts ) {	
			
			//calculate horizontal and vertical velocity
			//these will remane the same for the Bullet.
			var radians = this.get('a') * (Math.PI / 180),
				xv = this.get('v') * Math.sin(radians),
				yv = this.get('v') * Math.cos(radians);

			this.set({
				'ox': atts.x, //origin x
				'oy': atts.y, //origin y
				'xv': parseFloat(xv.toFixed(1)), //horizontal (x) velocity
				'yv': parseFloat(yv.toFixed(1)) //vertical (y) velocity
			}); 
		},
		defaults : {
			'v': 10, //velocity
			'a': 0, //angle
			'x': 0, //horizontal
			'y': 0, //vertical
			'h': 3, //height
			'w': 3, //width
			'd': 5, //damage
			'type': 'bullet',
			'r': 300 //range
		},
		frame: function() {
			//calculate the new location
			var left = this.get('x') + this.get('xv'),
				top = this.get('y') - this.get('yv'),			
				hd = left - this.get('ox'), //horizontal distance
				vd = top - this.get('oy'), //vertical distance
				distance = Math.sqrt((hd * hd) + (vd * vd)); //distance travelled
			
			if(distance < this.get('r')) {
				//set it on the model
				this.set({
					'x': parseFloat((left).toFixed(1)),
					'y': parseFloat((top).toFixed(1))
				});
			} else {
				//if we are out of range trigger collide to destroy bullet
				this.collide();
			}
		},
		collide: function(model) {
			
			//TODO: Try and clean up the relationships between elements
			var type = "unknown";

			//it will equal undefined if collide is called due to range
			if(typeof model !== "undefined") {
				type = model.get('type');
			}

			//explosions don't detonate bullets
			if(type === "explosion") {
				return false;
			}

			this.destroy();
		}
	});
	
	return BulletModel;
});

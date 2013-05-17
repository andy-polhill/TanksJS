define([
	'underscore',
	'backbone',
	'model/ExplosionModel'
], function(
	_, 
	Backbone, ExplosionModel) {

	var BulletModel = Backbone.Model.extend({

		initialize: function( atts, opts ) {	
				
			//listen to global frame advance
			this.collection.on('frame:advance', this.frame, this);
			
			//calculate horizontal and vertical velocity
			//these will remane the same for the Bullet.
			var radians = this.get('a') * (Math.PI / 180),
				xv = this.get('v') * Math.sin(radians),
				yv = this.get('v') * Math.cos(radians);

			this.set({
				'ox': atts.x, //origin x
				'oy': atts.y, //origin y
				'xv': parseFloat(xv.toFixed(0)), //horizontal (x) velocity
				'yv': parseFloat(yv.toFixed(0)) //vertical (y) velocity
			}); 
		},
		defaults : {
			'v': 10, //velocity
			'a': 0, //angle
			'x': 0, //horizontal
			'y': 0, //vertical
			'h': 3, //height
			'w': 3, //width
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
					'x': parseFloat((left).toFixed(0)),
					'y': parseFloat((top).toFixed(0))
				});
			} else {
				this.collide();
			}
		},
		collide: function(model) {
			
			var type = "unknown";

			if(typeof model !== "undefined") {
				type = model.get('type');
			}

			//TODO Don't explode when bullet goes off screen or hits another explosion
			//This is a bit scrappy
			if(!type.match(/bounds|explosion/g)) {

				this.collection.add(
					new ExplosionModel({
						'y': this.get('y'),
						'x': this.get('x'),
						'id': _.uniqueId()
					}, {
						'collection': this.collection
					})
				);
			}

			this.collection.off('frame:advance', this.frame, this);
			this.destroy();

		}
	});
	
	return BulletModel;
});

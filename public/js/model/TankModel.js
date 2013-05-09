define([
	'underscore',
	'backbone',
	'model/BulletModel'
], function(
	_, 
	Backbone,
	BulletModel) {

	var ANGLE_INC = 2;

	var TankModel = Backbone.Model.extend({

		initialize: function( atts ) {
			this.collection.on('frame:advance', this.frame, this);
			this.collection.on('kill:' + this.get('id'), this.registerKill, this);
		},
		defaults : {
			'fv': 1.5, //forward velocity
			'rv': 0.8, //reverse velocity
			'x': 0, //horizontal location
			'y': 0, //vertical location
			'w': 32, //width
			'h': 32, //height
			'kill': 0,
			'life': 10,
			'type': 'tank'
		},
		frame: function() {
			//TODO This function needs rationalising.
			var angle = this.get('a'),
				radians = angle * (Math.PI/180),
				move = this.get('move'),
				rotate = this.get('rotate'),
				x = this.get('x'),
				y = this.get('y'),
				fv = this.get('fv'),
				rv = this.get('rv'),
				cos = Math.cos(radians),
				sin = Math.sin(radians);

			if(_.isString(rotate)) {
				angle += ANGLE_INC * rotate
	
				if(angle > 360) angle = 0;
				if(angle < 0) angle = 360;
			}

			//TODO: No need for decimal places, yet removing them causes quirks
			switch(move) {
				case "1":
					//forwards
					x = parseFloat((x - (fv * cos)).toFixed(2));
					y = parseFloat((y - (fv * sin)).toFixed(2));
					break;
				case "-1":
					//backwards
					x = parseFloat((x + (rv * cos)).toFixed(2));
					y = parseFloat((y + (rv * sin)).toFixed(2));
					break;
			} 
			
			//set all the props at once to ensure previous atts is useful
			this.set({
				'x': x,
				'y': y,
				'a': angle
			});
		},
		shoot: function() {
			var cos, sin;

			var angle = this.get('a'),
				cos = (Math.cos(angle * Math.PI / 180)).toFixed(2),
				sin = (Math.sin(angle * Math.PI / 180)).toFixed(2),
				width = this.get('w') + 13,
				height = this.get('h') + 13,
				
				/* TODO: The above is a magic number which stops bullet colliding with own tank when
				at acute angles. the number also needs to take into account velocity of tank,
				as it may only shoot itself when moving, need to calculate this properly
				 */
				top = parseFloat(this.get('y') - ((height / 2) * sin)),
				left = parseFloat(this.get('x') - ((width / 2) * cos));
			
			this.collection.add(
				new BulletModel({
					'a': angle,
					'y': top,
					'x': left,
					'tank': this.get('id'),
					'id': _.uniqueId()
				}, {
					'collection': this.collection
				})
			);
		},
		collide: function(model) {
			var type = model.get('type');
			switch(type) {
				case "bullet":
					//loose a life
					var life = this.get('life') - 1
					if(life < 0) {
						//trigger kill event globally
						this.collection.off('frame:advance', this.frame, this);
						this.collection.trigger('kill:' + model.get('tank'));
						this.destroy();
					} else {
						this.set('life', life);
					}
				break;
				default:
					//you can't move here, revert to previous position
					this.set({
						'x': this.previous('x'),
						'y': this.previous('y')
					});
				break;		
			}
		},
		registerKill: function() {
			//you done a kill
			this.set('kill', this.get('kill') + 1);
		}
	});

	return TankModel;
});

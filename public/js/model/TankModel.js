define([
	'underscore',
	'backbone',
	'model/BulletModel',
	'model/ExplosionModel'
], function(
	_, 
	Backbone, BulletModel, ExplosionModel) {

	var ANIMATION_RATE = 2;

	var TankModel = Backbone.Model.extend({

		//TODO:width and height are duplicated in CSS.

		initialize: function( atts ) {
			this.collection.on('frame:advance', this.frame, this);
			this.collection.on('kill:' + this.get('id'), this.registerKill, this);
		},
		defaults : {
			'fv': 2.4, //forward velocity
			'rv': 1.2, //reverse velocity
			'x': 0, //horizontal location
			'y': 0, //vertical location
			'tc' : 3, //turning circle
			'w': 34, //width
			'h': 33, //height
			'ff': 0, //flare frame
			'tf': 0, //tank frame
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
				ff = this.get('ff'),
				tf = this.get('tf'),
				x = this.get('x'),
				y = this.get('y'),
				fv = this.get('fv'),
				rv = this.get('rv'),
				cos = Math.cos(radians),
				sin = Math.sin(radians);

			if(_.isString(rotate)) {
				angle += this.get('tc') * rotate
				if(angle > 360) angle = 0;
				if(angle < 0) angle = 360;
			}

			//set the flare frame, used for rendering flare
			if(ff > 0) {
				ff = ff - 1;
			}

			//TODO: No need for decimal places, yet removing them causes quirks
			switch(move) {
				case "1":
					//forwards
					x = parseFloat((x + (fv * sin)).toFixed(0));
					y = parseFloat((y - (fv * cos)).toFixed(0));
					tf = (tf > 0) ? 0 : 1;
					break;
				case "-1":
					//backwards
					x = parseFloat((x - (rv * sin)).toFixed(0));
					y = parseFloat((y + (rv * cos)).toFixed(0));
					tf = (tf > 0) ? 0 : 1;
					break;
			} 
			
			//set all the props at once to ensure previous atts is useful
			this.set({
				'x': x,
				'y': y,
				'a': angle,
				'ff': ff,
				'tf': tf
			});
		},
		shoot: function() {
		
			var angle = this.get('a'),
				cos = Math.cos(angle * Math.PI / 180),
				sin = Math.sin(angle * Math.PI / 180),
				width = this.get('w') / 2,
				height = this.get('h') / 2,				
				top = parseFloat(((this.get('y') + height) - ((height + 2) * cos)).toFixed(0)),
				left = parseFloat(((this.get('x') + width) + ((width + 2) * sin)).toFixed(0));

				/* TODO: The above contains a magic number which stops bullet colliding with own tank when
				at acute angles. the number also needs to take into account velocity of tank,
				as it may shoot itself when moving, need to calculate this properly
				 */

			//set frame to start flare animation			
			this.set('ff', 6);			
			
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
					var life = this.get('life') - 1;

					if(life < 0) {
						//trigger kill event globally
						this.collection.add(
							new ExplosionModel({
								'y': this.get('y'),
								'x': this.get('x'),
								'id': _.uniqueId()
							}, {
								'collection': this.collection
							})
						);
						this.collection.off('frame:advance', this.frame, this);
						this.collection.trigger('kill:' + model.get('tank'));
						this.destroy();
					} else {
						this.set('life', life);
					}
				break;
				case "explosion": //Do nothing
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

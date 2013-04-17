var Backbone = require('backbone'),
	_ = require('underscore'),
	BulletModel = require('./BulletModel'),
	define = require('amdefine')(module);

define(function(require) {

	var ANGLE_INC = 3;

	var TankModel = Backbone.Model.extend({

		initialize: function( atts, opts ) {
			this.events = opts.events;
			this.events.on('frame:advance', this.frame, this);
		},
		defaults : {
			'fv': 1.5, //forward velocity
			'rv': 0.8, //reverse velocity
			'x': 0, //horizontal location
			'y': 0, //vertical location
			'w': 32, //width
			'h': 32, //height
			'life': 10,
			'type': 'tank'
		},
		frame: function() {

			//TODO This function needs rationalising.
			var angle = this.get('a'),
				radians = angle * (Math.PI/180),
				x = this.get('x'),
				y = this.get('y'),
				fv = this.get('fv'),
				rv = this.get('rv'),
				cos = Math.cos(radians),
				sin = Math.sin(radians),

				rotate = this.get('rotate'),
				inc;

			if(_.isString(rotate)) {
				switch(rotate) {
					case "right":
						inc = ANGLE_INC * 1
						break;
					case "left":
						inc = ANGLE_INC * -1
						break
				}
				
				angle += inc;
	
				if(angle > 360) {
					angle = 0;
				}
				if(angle < 0) {
					angle = 360;
				}
			}

			var move = this.get('move');
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
					'id': _.uniqueId()
				}, {
					'events': this.events
				})
			);
		},
		life: function(operator) {
			var life = this.get('life');
			life += operator;
			if(life < 0) {
				this.unset('id');
				this.destroy();
			}
			this.set('life', life);		
		},
		collide: function(model) {
			var type = model.get('type');
			switch(type) {
				case "bullet":
					this.life(-1);
					break;
				default:
					this.set({
						'x': this.previous('x'),
						'y': this.previous('y'),
						'move': false
					});
					break;		
			}
		},
		
		//randomly position the tank
		randomPosition: function(maxX, maxY) {
			this.set({
				'x': _.random(0, maxX),
				'y': _.random(0, maxY),
				'a': _.random(0, 360)
			}, {
				'silent': true
			});
			return this;
		}
	});
	
	return TankModel;
});

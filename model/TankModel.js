var Backbone = require('backbone'),
	_ = require('underscore'),
	BulletModel = require('./BulletModel'),
	define = require('amdefine')(module);

define(function(require) {

	var ANGLE_INC = 5;

	var TankModel = Backbone.Model.extend({

		initialize: function( atts, opts ) {
			this.events = opts.events;
			this.events.on('frame:advance', this.frame, this);
		},
		defaults : {
			'v': 1.5, //velocity
			'x': 0, //horizontal location
			'y': 0, //vertical location
			'w': 32, //width
			'h': 32, //height
			'a': 180,
			'life': 5,
			'bulletCount': 0
		},
		frame: function() {

			var angle = this.get('a'),
				radians = angle * (Math.PI/180),
				x = this.get('x'),
				y = this.get('y'),
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

			if(this.get('move')) {
			
				x = parseFloat((this.get('x') - (this.get('v') * cos)).toFixed(2));
				y = parseFloat((this.get('y') - (this.get('v') * sin)).toFixed(2));
			}
			
			this.set({
				'x': x,
				'y': y,
				'a': angle
			});
		},
		shoot: function() {
			var count = this.get('bulletCount');
			count++;

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
					'a': this.get('a'),
					'y': top,
					'x': left,
					'type': 'bullet',
					'id': this.get('id') + ":" + count
				}, {
					'events': this.events
				})
			);			
			this.set('bulletCount', count);
		},
		life: function(operator) {
			var life = this.get('life');
			life += operator;
			if(life < 0) {
				console.log("*BAM!*");
				this.unset('id');
				this.destroy();
			}
			this.set('life', life);		
		},
		collide: function(model) {
			var type = model.get('type');
			console.log('collide with %d', type);
			switch(type) {
				case "bullet":
					this.life(-1)
					break;
				default:
					this.set({
						'x': this.previous('x'),
						'y': this.previous('y'),
						'move': false
					});
					break;		
			}
		}
	});
	
	return TankModel;
});

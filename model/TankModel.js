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
			'velocity': 1.5,
			'angle': 180,
			'left': 0,
			'top': 0,
			'width': 32,
			'height': 32,
			'life': 5,
			'bulletCount': 0
		},
		frame: function() {
			if(this.get('move')) {
				this._move();
			}
			if(_.isString(this.get('rotate'))) {
				this._rotate();
			}
		},
		_move: function() {
			var radians = this.get('angle') * (Math.PI/180),
				cos = Math.cos(radians);
				sin = Math.sin(radians);
			this.set('left', parseFloat((this.get('left') - (this.get('velocity') * cos)).toFixed(2)));
			this.set('top', parseFloat((this.get('top') - (this.get('velocity') * sin)).toFixed(2)));
		},
		_rotate: function() {
			//TODO: make this cleaner
			var angle = this.get('angle'),
				rotate = this.get('rotate'),
				inc;
				
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

			this.set('angle', angle);
		},
		shoot: function() {
			var count = this.get('bulletCount');
			count++;

			var cos, sin;

			var angle = this.get('angle'),
				cos = (Math.cos(angle * Math.PI / 180)).toFixed(2),
				sin = (Math.sin(angle * Math.PI / 180)).toFixed(2),
				width = this.get('width') + 9,
				height = this.get('height') + 9,
				/* TODO: 9 is a magic number which stops bullet colliding with own tank when
				at acute angles. If radial collision detection is implemented this can be removed */
				top = parseFloat(this.get('top') - ((height / 2) * sin)),
				left = parseFloat(this.get('left') - ((width / 2) * cos));
			
			this.collection.add(
				new BulletModel({
					'angle': this.get('angle'),
					'top': top,
					'left': left,
					'type': 'bullet',
					'id': this.get('id') + ":" + count
				}, {
					'events': this.events
				})
			);			
			this.set('bulletCount', count);
		},
		life: function(operator) {
			console.log("*HIT!*");
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
			console.log('collsion with: ' + type);
			switch(type) {
				case "bullet" :
					this.life(-1)
					break;			
			}
		}
	});
	
	return TankModel;
});

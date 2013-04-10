var Backbone = require('backbone'),
	_ = require('underscore'),
	define = require('amdefine')(module);

define(function(require) {

	var ANGLE_INC = 5;

	var TankModel = Backbone.Model.extend({

		initialize: function( atts, opts ) {
			opts.events.on('frame:advance', this.frame, this);
		},
		defaults : {
			'velocity' : 1.5,
			'angle' : 0,
			'left' : 0,
			'top' : 0
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
			this.set('left', (this.get('left') - (this.get('velocity') * cos)).toFixed(2));
			this.set('top', (this.get('top') - (this.get('velocity') * sin)).toFixed(2));
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
		shoot: function(shoot) {
			console.log('fire');
		}
		
	});
	
	return TankModel;
});

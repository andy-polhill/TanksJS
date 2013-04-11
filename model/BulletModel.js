var Backbone = require('backbone'),
	_ = require('underscore'),
	define = require('amdefine')(module);

define(function(require) {

	var BulletModel = Backbone.Model.extend({

		initialize: function( atts, opts ) {
			opts.events.on('frame:advance', this.frame, this);

			var radians = this.get('angle') * (Math.PI/180),
				cos = Math.cos(radians),
				sin = Math.sin(radians);

			this.set('xv', this.get('velocity') * cos); //horizontal (x) velocity
			this.set('yv', this.get('velocity') * sin); //vertical (y) velocity
		},
		defaults : {
			'velocity' : 4,
			'angle' : 0,
			'left' : 0,
			'top' : 0
		},
		frame: function() {
			var left = this.get('left') - this.get('xv');
			var top = this.get('top') - this.get('yv');
			this.set('left', (left).toFixed(2));
			this.set('top', (top).toFixed(2));
			
			if(left > 600 || top > 400 || left < 0 || top < 0) {
				this.unset('id');
				this.destroy();
			}
			
		}
	});
	
	return BulletModel;
});

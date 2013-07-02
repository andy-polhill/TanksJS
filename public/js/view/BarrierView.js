define([
	'underscore',
	'backbone'
], function(_, Backbone, BarrierTemplate) {

	var FRAMES = [0,45,90,135],
		FRAMES_LENGTH = FRAMES.length - 1;
	
	var BarrierView = Backbone.View.extend({
			
		initialize: function(opts) {

			this.img = new Image();
			this.img.src = '/img/barrier-sprite.png';

			this.model.on('remove', this.remove, this);
			
			this.setElement();
			this.ctx = opts.ctx;
		},

		render: function() {

			var w = this.model.get('w')
			,	h = this.model.get('h')
			,	x = this.model.get('x')
			,	y = this.model.get('y')
			,	l = this.model.get('life')
			,	ox = FRAMES_LENGTH - Math.floor(( l / this.model.get('maxLife')) * FRAMES_LENGTH);
			
	        this.ctx.drawImage(this.img, FRAMES[ox], 0, w, h, x, y, w, h);
			
		}
	});
  
	return BarrierView;

});
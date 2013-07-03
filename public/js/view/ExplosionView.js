define([
	'underscore', 'backbone'
	
], function(_, Backbone){

	var X_POS = [0,28,56,84,116,152,156,184,216,240]
	,	RATE = 4;

	var ExplosionView = Backbone.View.extend({
		
		initialize: function( opts ) {

			this.img = new Image();
			this.img.src = '/img/explosions.png';

			this.model.on('remove', this.remove, this);
			this.frame = 0;
			
			this.setElement();
			this.ctx = opts.ctx;
		},
		
		render: function() {
		
			var w = this.model.get('w')
			,	h = this.model.get('h')
			,	x = this.model.get('x')
			,	y = this.model.get('y');
	
			this.ctx.drawImage(this.img, X_POS[Math.round(this.frame/RATE)], 0, w, h, x, y, w, h);
			this.frame++;
		}
	});
  
  return ExplosionView;

});
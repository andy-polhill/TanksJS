define([
	'underscore',
	'backbone'
], function(_, Backbone){

	var LifeView = Backbone.View.extend({
		
		initialize: function(opts) {

			this.img = new Image();
			this.img.src = '/img/heart.png';

			this.model.on('remove', this.remove, this);
			
			this.setElement();
			this.ctx = opts.ctx;
		},

		render: function() {

			this.ctx.drawImage(
				this.img, 
				this.model.get('x'),
				this.model.get('y')
			);
		}
	});
  
  return LifeView;

});
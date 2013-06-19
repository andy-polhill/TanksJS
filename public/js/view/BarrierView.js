define([
	'underscore',
	'backbone'
], function(_, Backbone, BarrierTemplate) {

	var BarrierView = Backbone.View.extend({
	
		className: "barrier",
		
		initialize: function(opts) {

			this.model.on('change:life', this.life, this);
			this.model.on('remove', this.remove, this);
			this.setElement();
			this.ctx = opts.ctx;
		},

		render: function() {

			this.ctx.fillStyle="blue";		
			this.ctx.fillRect(
				this.model.get('x'), 
				this.model.get('y'), 
				this.model.get('w'), 
				this.model.get('h')
			);
		},
		
		life: function() {
		
			this.$el.attr({
				'data-frame': Math.round(this.model.get('life')/20)
			});
		}
	});
  
	return BarrierView;

});
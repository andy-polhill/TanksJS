define([
	'jquery',
	'underscore',
	'backbone'
], function( $, _, Backbone, BarrierTemplate) {

	var BarrierView = Backbone.View.extend({
	
		className: "barrier",
		
		initialize: function() {

			this.model.on('change:life', this.life, this);
			this.model.on('remove', this.remove, this);
	
			this.el.style.cssText = 
				"top: " + this.model.get('y') +
				"px; left: " + this.model.get('x') + 'px;';
		},
		
		life: function() {
		
			this.$el.attr({
				'data-frame': Math.round(this.model.get('life')/20)
			});
		}
	});
  
	return BarrierView;

});
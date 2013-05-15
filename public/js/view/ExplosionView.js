define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$, _, Backbone){

	var ExplosionView = Backbone.View.extend({
  		className: 'explosion',
		initialize: function( opts ) {
			this.model.on("change", this.render, this);
			this.model.on('remove', this.remove, this);

			this.el.style.cssText = 
				"top: " + this.model.get('y') +
				"px; left: " + this.model.get('x') + 'px;';

			this.render();
		},
		render: function() {
			//set all props at same time.
			this.$el.attr('data-frame', this.model.get('f'));
		}
	});
  
  return ExplosionView;

});
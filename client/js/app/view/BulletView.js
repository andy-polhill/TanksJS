define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$, _, Backbone){

	var BulletView = Backbone.View.extend({
  		className: 'bullet',
		initialize: function( opts ) {
			this.model.on("change", this.render, this);
			this.model.on('remove', this.remove, this);
			this.render();
		},
		render: function() {
			//set all props at same time.
			this.el.style.cssText = 
				"top: " + this.model.get('y') +
				"px; left: " + this.model.get('x') + 'px;';
		}
	});
  
  return BulletView;

});
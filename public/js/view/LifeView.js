define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$, _, Backbone){

	var LifeView = Backbone.View.extend({
		
		className: "life",
		
		initialize: function() {
		
			this.model.on('remove', this.remove, this);
			this.el.style.cssText = 
				"top: " + this.model.get('y') +
				"px; left: " + this.model.get('x') + 'px;';
		}
	});
  
  return LifeView;

});
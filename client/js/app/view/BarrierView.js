define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$, _, Backbone, BarrierTemplate) {

	var BarrierView = Backbone.View.extend({
  		className: "barrier",
		initialize: function() {
			this.render(); //correctly position
		},
		render: function() {
			this.el.style.cssText = 
				"top: " + this.model.get('y') +
				"px; left: " + this.model.get('x') + 'px;';
		}
	});
  
	return BarrierView;

});
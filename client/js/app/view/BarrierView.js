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
			this.$el.css("left", this.model.get('x'));
			this.$el.css("top", this.model.get('y'));
		}
	});
  
	return BarrierView;

});
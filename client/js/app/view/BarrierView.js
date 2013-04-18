// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'text!template/BarrierTemplate.html'
], function(
	$, _, Backbone, BarrierTemplate) {

	var BarrierView = Backbone.View.extend({
  
		initialize: function( opts ) {
			var tmpl = _.template( this.template );
			this.$el.html( tmpl() );
			opts.$parent.append(this.$el);
			this.$barrier = this.$el.find('.barrier');

			this.render(); //correctly position
		},
		template: BarrierTemplate,
		render: function() {
			this.$barrier.css("left", this.model.get('x'));
			this.$barrier.css("top", this.model.get('y'));
		}
	});
  
	return BarrierView;

});
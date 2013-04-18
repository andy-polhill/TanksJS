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
			this.$el.html( tmpl( this.model.toJSON() ) );
			opts.$parent.append(this.$el);
		},
		template: BarrierTemplate,
	});
  
	return BarrierView;

});
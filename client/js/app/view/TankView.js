// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'model/TankModel'
], function(
	$, _, Backbone, TankModel){

	var TankView = Backbone.View.extend({
  
		initialize: function( opts ) {
			this.$el = $("<div class='tank' />");
			opts.$parent.append(this.$el);
			this.model.on("change:life", this.pulse, this);
			this.model.on('remove', this.remove, this);
			this.render();
		},
		render: function() {		
			this.$el.css("left", this.model.get('x'));
			this.$el.css("top", this.model.get('y'));
			
			var rotateAttr = 'rotate(' + this.model.get('a') + 'deg)';
			this.$el.css('-moz-transform', rotateAttr);
			this.$el.css('-webkit-transform', rotateAttr);		
		},
		pulse: function() {
			
		}
	});
  
	return TankView;

});
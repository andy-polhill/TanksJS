// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone'
], function(
	$, _, Backbone){

	var BulletView = Backbone.View.extend({
  
		initialize: function( opts ) {
			this.$el = $("<div class='bullet' />");
			opts.$parent.append(this.$el);
			this.model.on("change", this.render, this);
			this.model.on('remove', this.remove, this);
			this.render();
		},
		render: function() {		
			this.$el.css("left", this.model.get('x'));
			this.$el.css("top", this.model.get('y'));
		}
	});
  
  return BulletView;

});
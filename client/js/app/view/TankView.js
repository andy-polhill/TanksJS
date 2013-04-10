// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'model/TankModel'
], function(
	$, _, Backbone, TankModel){

  var TankView = Backbone.View.extend({
  
	events: {
		"keyup" : "control",
		"keydown" : "control"
	},
	initialize: function( opts ) {
		this.$el = $("<div class='tank' />");
		opts.$parent.append(this.$el);
		this.model.on("change", this.render, this);
		this.model.on('remove', this.remove, this);
	},
	render: function() {		
		this.$el.css("left", this.model.get('left'));
		this.$el.css("top", this.model.get('top'));
		
		var rotateAttr = 'rotate(' + this.model.get('angle') + 'deg)';
		this.$el.css('-moz-transform', rotateAttr);
		this.$el.css('-webkit-transform', rotateAttr);		
	}
  });
  
  return TankView;

});
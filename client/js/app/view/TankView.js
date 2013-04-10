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
	initialize: function() {
		this.$tank = $("<div class='tank' />");
		this.$el.append(this.$tank);
		this.model.on("change", this.render, this);
	},	
	render: function() {		
		this.$tank.css("left", this.model.get('left'));
		this.$tank.css("top", this.model.get('top'));
		
		var rotateAttr = 'rotate(' + this.model.get('angle') + 'deg)';
		this.$tank.css('-moz-transform', rotateAttr);
		this.$tank.css('-webkit-transform', rotateAttr);		
	}
  });
  
  return TankView;

});
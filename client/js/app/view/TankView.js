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
		this.model = new TankModel();
		this.model.on("change", this.render, this);		

	},	
	render: function() {
		this.$tank.css(this.model.get('position'));
	},
	control: function( evt ) {
		
		var move = (evt.type === 'keydown') ? true : false;

		switch(evt.which) {
			case 38: //up
				this.model.set('move', move)
				break;
			case 37: //rotate left
				break;
			case 39: //rotate right
				break;
		}
	}
  });
  
  return TankView;

});
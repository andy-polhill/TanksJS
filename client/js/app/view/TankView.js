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
		this.model.on("change:position", this.render, this);		

	},	
	render: function() {
		this.$tank.css("left", this.model.get('position').left);
		this.$tank.css("top", this.model.get('position').top);
		var rotateAttr = 'rotate(' + this.model.get('position').angle + 'deg)';
		this.$tank.css('-moz-transform', rotateAttr);
		this.$tank.css('-webkit-transform', rotateAttr);		
	},
	control: function( evt ) {
		
		var isKeydown = (evt.type === 'keydown') ? true : false;

		switch(evt.which) {
			case 38: //up
				this.model.set('move', isKeydown);
				break;
			case 37: //rotate left
				if(isKeydown) {
					this.model.set('rotate', 'left');
				} else {
					this.model.set('rotate', null);
				}
				break;
			case 39: //rotate right
				if(isKeydown) {
					this.model.set('rotate', 'right');
				} else {
					this.model.set('rotate', null);
				}
				break;
			case 32: //spacebar
				//this.fire()
				break;
		}
	}

  });
  
  return TankView;

});
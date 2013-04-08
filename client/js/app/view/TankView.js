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
		var rotateAttr = 'rotate(' + this.model.get('angle') + 'deg)';
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
				if(isKeydown){
					if(!this.rotateTimeout) {
						this.rotateTimeout = setInterval($.proxy(function() { 
							this.rotate(-5)
						}, this), 100);
					}
				} else {
					clearInterval(this.rotateTimeout);
					delete this.rotateTimeout;
				}
				break;
			case 39: //rotate right
				if(isKeydown){
					if(!this.rotateTimeout) {
						this.rotateTimeout = setInterval($.proxy(function() {
							this.rotate(5)
						}, this), 100);
					}
				} else {
					clearInterval(this.rotateTimeout);
					delete this.rotateTimeout;
				}
				break;
		}
	},
	rotate: function( increment ) {

		var angle = this.model.get('angle');
		angle += increment;
		if(angle > 360) {
			angle = 0; //TODO: more accuracy
		}
		this.model.set('angle', angle);
	}
  });
  
  return TankView;

});
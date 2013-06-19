define([
	'underscore',
	'backbone',
	'text!template/TankTemplate.html'
], function(_, Backbone, TankTemplate) {

	var TankView = Backbone.View.extend({
	
		className: "tank",

		initialize: function( opts ) {

			this.setElement();
			this.ctx = opts.ctx;
		},
		
		template: TankTemplate,
		
		render: function() {

			this.ctx.fillStyle="green";		
			this.ctx.fillRect(
				this.model.get('x'), 
				this.model.get('y'), 
				this.model.get('w'), 
				this.model.get('h')
			);
		},
		
		life: function() {
			//change to life property
			//TODO: use percentages
			this.lifeBar.style.cssText = "width:" + this.model.get('life') / 2 + "px;";
		},
		
		heat: function() {
		
			//change to life property
			var heat = this.model.get('heat'),
				width = ( heat > 0) ? heat : 0; 
			this.heatBar.style.cssText = "width:" + width + "px;";
		},
		
		kill: function() {
			//this tank done a kill
			this.$kills.html(this.model.get('kill'));
		}
	});
  
	return TankView;

});
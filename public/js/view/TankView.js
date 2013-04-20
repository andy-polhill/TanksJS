define([
	'jquery',
	'underscore',
	'backbone',
	'text!template/TankTemplate.html'
], function(
	$, _, Backbone, TankTemplate) {

	var TankView = Backbone.View.extend({
		className: "tank",
		initialize: function( opts ) {
			var tmpl = _.template( this.template );
			this.$el.html( tmpl() );

			this.tank = this.$el.find('.tankBody').get(0);
			this.$kills = this.$el.find('.kills span');
			
			this.model.on('change:life', this.life, this);
			this.model.on('change:kill', this.kill, this);
			this.model.on('remove', this.remove, this);

			this.render(); //correctly position
			this.life(); //set life bar
			this.kill(); //set kill count
		},
		template: TankTemplate,
		render: function() {
			var rotateAttr = 'rotate(' + this.model.get('a') + 'deg)';

			this.el.style.cssText = 
				"top: " + this.model.get('y') +
				"px; left: " + this.model.get('x') + 'px;';
			
			this.tank.style.cssText = 
				"-moz-transform: " + rotateAttr +
				"; -webkit-transform: " + rotateAttr;
		},
		life: function() {
			//change to life property
			this.$el.attr('data-life', this.model.get('life'));
		},
		kill: function(model, kills) {
			//this tank done a kill
			this.$kills.html(kills);
		}
	});
  
	return TankView;

});
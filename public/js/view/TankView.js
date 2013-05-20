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
			this.$el.html( tmpl( this.model.toJSON() ) );
			this.$el.addClass( this.model.get('variant') );

			this.tank = this.$el.find('.tankBody').get(0);
			this.lifeBar = this.$el.find('.lifeBar div').get(0);
			this.heatBar = this.$el.find('.heatBar div').get(0);
			this.$kills = this.$el.find('.kills span');
			
			this.model.on('change:life', this.life, this);
			this.model.on('change:kill', this.kill, this);
			this.model.on('change:heat', this.heat, this);
			this.model.on('remove', this.remove, this);

			this.render(); //correctly position
			this.life(); //set life bar
			this.kill(); //set kill count
		},
		template: TankTemplate,
		render: function() {
			var rotateAttr = 'rotate(' + this.model.get('a') + 'deg)';

			this.$el.attr({
				'data-flare-frame': this.model.get('ff'),
				'data-track-frame': this.model.get('tf')
			});

			this.el.style.cssText = 
				"top: " + this.model.get('y') +
				"px; left: " + this.model.get('x') + 'px;';
			
			this.tank.style.cssText = 
				"-moz-transform: " + rotateAttr +
				"; -webkit-transform: " + rotateAttr;
		},
		life: function() {
			//change to life property
			this.lifeBar.style.cssText = "width:" + this.model.get('life') / 3 + "px;"
		},
		heat: function() {
			//change to life property
			var heat = this.model.get('heat'),
				width = ( heat > 0) ? heat : 0; 
			this.heatBar.style.cssText = "width:" + width + "px;"
		},
		kill: function() {
			//this tank done a kill
			this.$kills.html(this.model.get('kill'));
		}
	});
  
	return TankView;

});
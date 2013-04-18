// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'text!template/TankTemplate.html'
], function(
	$, _, Backbone, TankTemplate) {

	var TankView = Backbone.View.extend({
  
		initialize: function( opts ) {
			var tmpl = _.template( this.template );
			this.$el.html( tmpl() );
			opts.$parent.append(this.$el);
			
			this.$tank = this.$el.find('.tank');
			this.$tankBody = this.$el.find('.tankBody');
			
			this.model.on("change:life", this.life, this);
			this.model.on('remove', this.remove, this);

			this.render(); //correctly position
			this.life(); //set life bar
		},
		template: TankTemplate,
		render: function() {		
			this.$tank.css("left", this.model.get('x'));
			this.$tank.css("top", this.model.get('y'));
			
			var rotateAttr = 'rotate(' + this.model.get('a') + 'deg)';
			this.$tankBody.css('-moz-transform', rotateAttr);
			this.$tankBody.css('-webkit-transform', rotateAttr);		
		},
		life: function() {
			this.$tank.attr('data-life', this.model.get('life'));
		}
	});
  
	return TankView;

});
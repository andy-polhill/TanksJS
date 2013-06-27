define([
	'underscore',
	'backbone',
	'view/ExplosionView'
], function(_, Backbone, ExplosionView){

	var BulletView = Backbone.View.extend({

		initialize: function( opts ) {

			this.ctx = opts.ctx;
			this.model.on('remove', this.remove, this);		
			this.setElement();
			this.render();
		},

		render: function() {
			this.ctx.fillStyle="black";
			this.ctx.fillRect(
				this.model.get('x'), 
				this.model.get('y'), 
				this.model.get('w'), 
				this.model.get('h')
			);
		}
	});
  
  return BulletView;

});
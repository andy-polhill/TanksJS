define([
	'underscore',
	'backbone',
	'text!template/GameOverTemplate.html'
], function(_, Backbone, GameOverTemplate){

	var GameOverView = Backbone.View.extend({
			
		template: GameOverTemplate,		
		
		render: function() {
		
			var tmpl = _.template(this.template);
			this.$el.html(tmpl());

			return this.$el;
		}
	});
  
  return GameOverView;

});
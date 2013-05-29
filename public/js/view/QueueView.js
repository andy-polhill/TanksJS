define([
	'underscore',
	'backbone',
	'text!template/QueueTemplate.html'
], function(_, Backbone, QueueTemplate){

	var QueueView = Backbone.View.extend({
	
		initialize: function(opts) {
		
			this.model.on("change", this.render, this);
		},
		
		template: QueueTemplate,		
		
		render: function() {
		
			var tmpl = _.template(this.template);
			this.$el.html(tmpl(this.model.toJSON()));
			return this.$el;
		}
	});
  
  return QueueView;

});
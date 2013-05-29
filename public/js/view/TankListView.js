define([
	'jquery',
	'underscore',
	'backbone',
	'text!template/TankListTemplate.html'
], function(
	$, _, Backbone, TankListTemplate){

	var TanksListView = Backbone.View.extend({
	
		initialize: function(opts) {
			this.collection.on("reset", this.render, this);
		},
		
		events: {
			'click article button' : 'selectTank'
		},

		template: TankListTemplate,		
		
		render: function() {
			var tmpl = _.template(this.template);
			this.$el.html(tmpl({
				tanks : this.collection.toJSON()
			}));
			return this.$el;
		},
		
		selectTank: function(evt) {
			Vents.trigger("select:tank", {'variant' : $(evt.target).data('variant')});
			return false;
		}
	});

  return TanksListView;

});
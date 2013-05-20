define([
	'jquery',
	'underscore',
	'backbone',
	'text!template/OptionsTemplate.html'
], function(
	$, _, Backbone, OptionsTemplate){

	var TanksListView = Backbone.View.extend({
		initialize: function( opts ) {
			this.render();
			this.collection.on("add", this.render, this);
		},
 		events: {
 			'click .select' : 'selectTank'
 		},
		template : OptionsTemplate,		
		render : function() {
			console.log('render');
			var tmpl = _.template(this.template);
	        this.$el.html(tmpl({
	        	tanks : this.collection.toJSON()
        	}));
		},
		selectTank : function( evt ) {
			var variant = $(evt.target).data('variant');
			Vents.trigger("select:tank", {'variant' : variant});
			return false;
		}
	});
  
  return TanksListView;

});
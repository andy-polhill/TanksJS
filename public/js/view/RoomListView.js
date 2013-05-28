define([
	'jquery',
	'underscore',
	'backbone',
	'text!template/RoomListTemplate.html'
], function(
	$, _, Backbone, RoomListTemplate){

	var RoomListView = Backbone.View.extend({
	
		initialize: function(opts) {
			this.collection.on("reset", this.render, this);
		},
		
 		events: {
 			'click article button' : 'selectRoom'
 		},
 		
		template: RoomListTemplate,		
		
		render: function() {
			var tmpl = _.template(this.template);
	        this.$el.html(tmpl({
	        	rooms : this.collection.toJSON()
        	}));
			return this.$el;
		},
		
		selectRoom: function(evt) {
			Vents.trigger("select:room", {'room' : $(evt.target).data('room')});
			return false;
		}
	});
  
  return RoomListView;

});
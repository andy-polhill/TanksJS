define([
	'underscore',
	'backbone', 
	'model/RoomModel'
	],

	function( _, Backbone, RoomModel ) {

	var RoomCollection = Backbone.Collection.extend({

		initialize : function(atts, opts) {

			this.add([{
				name: 'desert',
				id: _.uniqueId()
			}, {
				name: 'jungle',
				id: _.uniqueId()
			}, {
				name: 'urban',
				id: _.uniqueId()
			}], opts);
		},

		model: RoomModel
	});
	
	return RoomCollection;
});

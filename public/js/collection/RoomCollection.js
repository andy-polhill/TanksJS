define([
	'underscore',
	'backbone', 
	'model/RoomModel'
], function( _, Backbone, RoomModel ) {

	var RoomCollection = Backbone.Collection.extend({

		initialize : function(atts, opts) {

			this.add([{
				name: 'El Alamein',
				id: _.uniqueId()
			}, {
				name: 'Normandy',
				id: _.uniqueId()
			}, {
				name: 'Arracourt',
				id: _.uniqueId()
			}], opts);
		},

		model: RoomModel
		
	});
	
	return RoomCollection;
});

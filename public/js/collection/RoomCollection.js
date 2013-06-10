define([
	'underscore',
	'backbone', 
	'model/RoomModel'
], function( _, Backbone, RoomModel ) {

	var RoomCollection = Backbone.Collection.extend({

		initialize : function(atts, opts) {

			this.add([{
				name: 'Arena 1',
				id: _.uniqueId(),
				barriers: 10,
				lifeFreq: 700,
			}, {
				name: 'Arena 2',
				id: _.uniqueId(),
				barriers: 14,
				lifeFreq: 900,
			}, {
				name: 'Arena 3',
				id: _.uniqueId(),
				barriers: 8,
				lifeFreq: 500,
			}, {
				name: 'Arena 4',
				id: _.uniqueId(),
				barriers: 16,
				lifeFreq: 1300,
			}], opts);
		},

		model: RoomModel
		
	});
	
	return RoomCollection;
});

define([
	'underscore',
	'backbone', 
	'model/RoomModel'
], function( _, Backbone, RoomModel ) {

	var RoomCollection = Backbone.Collection.extend({

		initialize : function(atts, opts) {

			this.add([{
				name: 'arena-1',
				id: _.uniqueId(),
				barriers: 10,
				lifeFreq: 1400
			}, {
				name: 'arena-2',
				id: _.uniqueId(),
				barriers: 14,
				lifeFreq: 1400
			}, {
				name: 'arena-3',
				id: _.uniqueId(),
				barriers: 8,
				lifeFreq: 1400
			}, {
				name: 'arena-4',
				id: _.uniqueId(),
				barriers: 16,
				lifeFreq: 1400
			}], opts);
		},

		model: RoomModel
		
	});
	
	return RoomCollection;
});

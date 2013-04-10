define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	var TankModel = Backbone.Model.extend({
		initialize: function() {
			console.log('initialize model');
		}
	});

	return TankModel;

});
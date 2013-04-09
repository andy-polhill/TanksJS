var Backbone = require('backbone'),
	TankModel = require('../model/TankModel'),
	define = require('amdefine')(module);

define(function(require) {
	var TankCollection = Backbone.Collection.extend({
		model : TankModel
	});
	
	return TankCollection;
});

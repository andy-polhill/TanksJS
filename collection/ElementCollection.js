var Backbone = require('backbone'),
	BulletModel = require('../model/BulletModel'),
	TankModel = require('../model/TankModel'),
	define = require('amdefine')(module);

define(function(require) {
	var ElementCollection = Backbone.Collection.extend({
		model : function(atts, opts) {
			switch(opts.type) {
				case 'bullet':
					return new BulletModel(atts, opts);
				case 'tank':
					return new TankModel(atts, opts);
			}
		}
	});
	
	return ElementCollection;
});

define([
	'underscore',
	'backbone',
	'model/TankModel',
	'model/BulletModel'
	
], function(_, Backbone, TankModel, BulletModel) {

	//TODO A lot of work to clean this up!!!!!!

	var ANIMATION_RATE = 2,
		HEAT_DROP = 10,
		HEAT_PENALTY = 20;

	var SpecialTankModel = TankModel.extend({
		defaults : {
			'w': 29,
			'h': 31,
			'tc' : 3, //turning circle
			'fv': 3.8, //forward velocity
			'rv': 2.2, //reverse velocity
			'variant': 'special-tank',
			'maxLife': 60,
			'life': 60,
			'heat': 90, //heat
			'maxHeat': 90,
			'weapon': {
				'v': 13, //velocity
				'h': 2, //height
				'w': 1, //width
				'd': 2, //damage
				'type': 'bullet',
				'r': 120 //range
			}
		},
		shoot: function() {

			var heat = this.get('heat');
			
			if(heat < 0) {
				//you have overheated
				this.set({
					'heat': heat - HEAT_DROP
				});
				
			} else {
		
				//TODO: shoot from the correct position (nightmare to work out!!)
		
				var angle = this.get('a'),
					cos = Math.cos(angle * Math.PI / 180),
					sin = Math.sin(angle * Math.PI / 180),				
					width = this.get('w') / 2,
					height = this.get('h') / 2,
					y = this.get('y'),
					x = this.get('x'),
					topFirst = parseFloat(((y + height) - ((height + 4) * cos) + 4).toFixed(0)),
					leftFirst = parseFloat(((x + width) + ((width + 4) * sin) + 4).toFixed(0)),
					topSecond = parseFloat(((y + height) - ((height + 4) * cos) - 4).toFixed(0)),
					leftSecond = parseFloat(((x + width) + ((width + 4) * sin) - 4).toFixed(0));
	
				//set frame to start flare animation			
				this.set({
					'ff': 6,
					'heat': heat - HEAT_DROP
				});
				
				this.collection.add(
					new BulletModel(
						_.extend(this.get('weapon'), {
							'a': angle,
							'y': topFirst,
							'x': leftFirst,
							'tank': this.get('id'),
							'id': _.uniqueId()
					}), {
						'collection': this.collection
					})
				);
					
				this.collection.add(
					new BulletModel(
						_.extend(this.get('weapon'), {
							'a': angle,
							'y': topSecond,
							'x': leftSecond,
							'tank': this.get('id'),
							'id': _.uniqueId()
					}), {
						'collection': this.collection
					})					
				);
			}
		},
	});

	_.defaults(SpecialTankModel.prototype.defaults, TankModel.prototype.defaults);

	return SpecialTankModel;
});

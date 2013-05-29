define([
	'underscore',
	'backbone',
	'model/BulletModel',
	'model/ElementModel'
], function(_, Backbone, BulletModel, ElementModel) {

	var ANIMATION_RATE = 2,
		HEAT_DROP = 10,
		HEAT_PENALTY = 40;

	var TankModel = ElementModel.extend({

		//TODO:width and height are duplicated in CSS.

		initialize: function( atts, opts ) {
		
			this.collection.on('kill:' + this.get('id'), this.registerKill, this);
			
			this.socket = opts.socket;
			
			//might not be a socket for unconnected tanks
			if(this.socket) {
				//set up user controls
				this.socket.on('tank:move', _.bind(this.move, this));
				this.socket.on('tank:rotate', _.bind(this.rotate, this));
				this.socket.on('tank:shoot', _.bind(this.shoot, this));
			}
		},
		
		defaults : {
			'a': 0, //angle
			'fv': 2.4, //forward velocity
			'rv': 1.2, //reverse velocity
			'x': 0, //horizontal location
			'y': 0, //vertical location
			'tc' : 3, //turning circle
			'w': 34, //width
			'h': 33, //height
			'ff': 0, //flare frame
			'tf': 0, //tank frame
			'kill': 0,
			'maxLife': 100,
			'life': 100,
			'heat': 30, //heat
			'maxHeat': 30,
			'type': 'tank',
			'variant': 'large-tank',
			'weapon': {
				'v': 10, //velocity
				'h': 3, //height
				'w': 3, //width
				'd': 6, //damage
				'type': 'bullet',
				'r': 350 //range
			}
		},
		
		move: function(move) {
		
			this.set('move', move);
		},
		
		rotate: function(rotate) {
		
			this.set('rotate', rotate);
		},
		
		frame: function() {
			
			//Get all of the properties that we use more than once
			var angle = this.get('a'),
				radians = angle * (Math.PI/180),
				move = this.get('move'),
				rotate = this.get('rotate'),
				heat = this.get('heat'),
				maxHeat = this.get('maxHeat'),
				flareFrame = this.get('ff'),
				tankFrame = this.get('tf'),
				x = this.get('x'),
				y = this.get('y'),
				forwardVelocty = this.get('fv'),
				reverseVelocity = this.get('rv'),
				cos = Math.cos(radians),
				sin = Math.sin(radians);

			//Increment the angle if we are rotating
			if(_.isString(rotate)) {
				angle += this.get('tc') * rotate;
				if(angle > 360) angle = 0;
				if(angle < 0) angle = 360;
			}

			//set the flare frame, used for rendering flare
			if(flareFrame > 0) {
				flareFrame = flareFrame - 1;
			}

			//Lower the heat sink after each shot
			if(heat < maxHeat) { //Where 30 is max heat
				heat++;
			}

			//Recalculate the position if the tank is moving
			switch(move) {
				case "1":
					//forwards
					x = parseFloat((x + (forwardVelocty * sin)).toFixed(1));
					y = parseFloat((y - (forwardVelocty * cos)).toFixed(1));
					tankFrame = (tankFrame > 0) ? 0 : 1;
					break;
				case "-1":
					//backwards
					x = parseFloat((x - (reverseVelocity * sin)).toFixed(1));
					y = parseFloat((y + (reverseVelocity * cos)).toFixed(1));
					tankFrame = (tankFrame > 0) ? 0 : 1;
					break;
			}

			//set all the props at once to ensure previous atts is useful
			this.set({
				'x': x,
				'y': y,
				'a': angle,
				'ff': flareFrame,
				'tf': tankFrame,
				'heat': heat
			});
		},
		
		shoot: function() {

			var heat = this.get('heat');
			
			if(heat < 0) {
				//you have overheated
				this.set({
					'heat': heat - HEAT_DROP
				});
				
			} else {
		
				var angle = this.get('a'),
					cos = Math.cos(angle * Math.PI / 180),
					sin = Math.sin(angle * Math.PI / 180),				
					width = this.get('w') / 2,
					height = this.get('h') / 2,				
					top = parseFloat(((this.get('y') + height) - ((height + 4) * cos)).toFixed(0)),
					left = parseFloat(((this.get('x') + width) + ((width + 4) * sin)).toFixed(0));
	
				//set frame to start flare animation	
				this.set({
					'ff': 6,
					'heat': heat - HEAT_DROP
				});

				var bullet = new BulletModel(
				_.extend(this.get('weapon'), {
					'a': angle,
					'y': top,
					'x': left,
					'tank': this.get('id'),
					'id': _.uniqueId()
				}), {
					'collection': this.collection
				});
				
				this.collection.add([bullet]);
			}
		},
		
		collide: function(model) {
			var type = model.get('type'),
			life;
			
			switch(type) {
				case "bullet":
					//life = life - damage
					life = this.get('life') - model.get('d');

					if(life < 0) {
						this.collection.trigger('kill:' + model.get('tank'));
						this.destroy();
					} else {
						this.set('life', life);
					}
				break;
				case "explosion": //Do nothing
				break;
				case "life":
					life = this.get('life') + model.get('life'),
						maxLife = this.get('maxLife');
						
					life = (life > this.get('maxLife')) ? maxLife : life;
					this.set('life', life);					
				break;
				default:
					//you can't move here, revert to previous position
					this.set({
						'x': this.previous('x'),
						'y': this.previous('y')
					});
				break;		
			}
		},
		
		registerKill: function() {
			//you done a kill
			this.set('kill', this.get('kill') + 1);
		}
	});

	return TankModel;
});

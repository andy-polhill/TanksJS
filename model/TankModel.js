var Backbone = require('backbone'),
	define = require('amdefine')(module);

define(function(require) {
	var TankModel = Backbone.Model.extend({
		initialize : function(atts, opts) {
			
			this.socket = opts.socket;
			this.frameRate = opts.frameRate;
			
			//TODO sort out this context nastiness
			var self = this;

			this.socket.on('move', function() {
				self.move.apply(self, arguments)
			});
			this.socket.on('rotate', function() {
				self.rotate.apply(self, arguments)
			});			
		},
		defaults : {
			'velocity' : 1.5,
			'angle' : 0,
			'left' : 0,
			'top' : 0
		},
		move: function(move) {

			//TODO sort out this context nastiness
			var self = this;

			if(move && !this.moveInterval) {
				console.log('move tank');
				this.moveInterval = setInterval(function() {
					self._move.apply(self, arguments)
				}, this.frameRate);
			} else if(!move && !this.moveInterval) {
				console.log('stop tank');
				clearInterval(this.moveInterval);
				delete this.moveInterval;
			}
		},
		_move: function() {

			//TODO sort out this context nastiness
			var self = this;

			var radians = this.get('angle') * (Math.PI/180),
				cos = Math.cos(radians);
				sin = Math.sin(radians);
				
			this.set('left', (this.get('left') - (this.get('velocity') * cos)).toFixed(2));
			this.set('top', (this.get('top') - (this.get('velocity') * sin)).toFixed(2));
		},
		rotate: function(rotate) {

			//TODO sort out this context nastiness
			var self = this;
				
			//TODO: refactor duplication
			switch(rotate) {
				case "left":
					if(!this.rotateInterval) {
						console.log('start left rotation');
						this.rotateInterval = setInterval(function() {
							self._rotate.apply(self, arguments)
						}, this.frameRate, -5);
					}
					break;
				case "right":
					if(!this.rotateInterval) {
						console.log('start right rotation');
						this.rotateInterval = setInterval(function() {
							self._rotate.apply(self, arguments)
						}, this.frameRate, 5);
					}			
					break;
				default:
					console.log('end rotation');
					clearInterval(this.rotateInterval);
					delete this.rotateInterval;	
			}
		},
		_rotate: function(inc) {
			var angle = this.get('angle');
			angle += inc;
			
			//TODO: make this cleaner
			if(angle > 360) {
				angle = 0;
			}
			if(angle < 0) {
				angle = 360;
			}
			this.set('angle', angle);
		}
	});
	
	return TankModel;
});

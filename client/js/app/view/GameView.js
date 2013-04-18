// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'view/TankView',
	'view/BarrierView',
	'view/BulletView'
], function(
	$, _, Backbone, TankView, BarrierView, BulletView){

  var GameView = Backbone.View.extend({
  
	events: {
		"keyup" : "control",
		"keydown" : "control"
	},
	initialize: function(opts) {
		this.socket = opts.socket;
		this.views = [];
		this.collection.on('add', this.add, this);
		this.collection.on('change', this.render, this);
	},	
	add: function(model) {			
		switch(model.get('type')) {
			case "tank": 
				this.views.push(
					new TankView({
						'model': model,
						'$parent': this.$el.find('#game')
					})
				);
			break;
			case "bullet": 
				this.views.push(
					new BulletView({
						'model': model,
						'$parent': this.$el.find('#game')
					})
				);
			break;
			case "barrier": 
				this.views.push(
					new BarrierView({
						'model': model,
						'$parent': this.$el.find('#game')
					})
				);
			break;
		}
	},	
	render: function() {
		_.each(this.views, function(view){
			view.render();
		})
	},
	control: function( evt ) {
		
		var isKeydown = (evt.type === 'keydown') ? true : false;

		switch(evt.which) {
			case 38: //up
				if(isKeydown) {
					this.socket.emit('move', '1');
				} else { 
					this.socket.emit('move', null);
				}
				evt.preventDefault();
				break;
			case 40: //down
				if(isKeydown) {
					this.socket.emit('move', '-1');
				} else {
					this.socket.emit('move', null);
				}
				evt.preventDefault();
				break;
			case 37: //rotate left
				if(isKeydown) {
					this.socket.emit('rotate', '-1');
				} else {
					this.socket.emit('rotate', null);
				}
				evt.preventDefault();
				break;
			case 39: //rotate right
				if(isKeydown) {
					this.socket.emit('rotate', '1');
				} else {
					this.socket.emit('rotate', null);
				}
				evt.preventDefault();
				break;
			case 32: //spacebar
				if(!isKeydown) {
					this.socket.emit('shoot', true);
				}
				evt.preventDefault();
				break;
		}
	}

  });
  
  return GameView;

});
// Filename: router.js
define([
	'jquery',
	'underscore',
	'backbone',
	'view/TankView'
], function(
	$, _, Backbone, TankView){

  var GameView = Backbone.View.extend({
  
	events: {
		"keyup" : "control",
		"keydown" : "control"
	},
	initialize: function(opts) {
		this.socket = opts.socket;
		console.log("game view el " + this.$el);
		this.views = [];
		this.collection.on('add', this.add, this);
		this.collection.on('change', this.render, this);
	},	
	add: function(model) {
		_.each(this.collection.models, function(model) {
			this.views.push(
				new TankView({
					'model': model,
					'$parent': this.$el
				})
			);
		}, this);
	},	
	render: function() {
		_.each(this.views, function(view){
			console.log('render view' + view);
			view.render();
		})
	},
	control: function( evt ) {
	
		console.log('control' + evt.which);
		
		var isKeydown = (evt.type === 'keydown') ? true : false;

		switch(evt.which) {
			case 38: //up
					this.socket.emit('move', isKeydown);
				break;
			case 37: //rotate left
				if(isKeydown) {
					this.socket.emit('rotate', 'left');
				} else {
					this.socket.emit('rotate', 'null');
				}
				break;
			case 39: //rotate right
				if(isKeydown) {
					this.socket.emit('rotate', 'right');
				} else {
					this.socket.emit('rotate', 'null');
				}
				break;
			case 32: //spacebar
				//this.fire()
				break;
		}
	}

  });
  
  return GameView;

});
define([
	'jquery',
	'underscore',
	'backbone',
	'view/TankView',
	'view/BarrierView',
	'view/BulletView',
	'view/ExplosionView',
	'view/LifeView',
	'text!template/GameTemplate.html'
], function(
	$, _, Backbone, TankView, BarrierView, BulletView, ExplosionView, LifeView, GameTemplate){

	var ELEMENTS = {
		'bullet' : BulletView,
		'tank' : TankView,
		'barrier' : BarrierView,
		'explosion' : ExplosionView,
		'life' : LifeView
	};

	var GameView = Backbone.View.extend({
  
		events: {
			"keyup" : "control",
			"keydown" : "control"
		},
		template: GameTemplate,
		initialize: function(opts) {
			this.socket = opts.socket;
			this.views = [];
			
			this.$el.find('#wrapper').html( _.template( this.template ) );
			this.$bounds = this.$el.find("#game");
			this.collection.on('add', this.add, this);
			this.collection.on('change', this.render, this);
		},			
		add: function(model) {	
			var view = new ELEMENTS[model.get('type')]({
				'model': model
			});
			this.$bounds.append(view.$el);
			this.views.push(view);
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
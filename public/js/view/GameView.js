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

	//type => constructor lookup
	var ELEMENTS = {
		'bullet' : BulletView,
		'tank' : TankView,
		'barrier' : BarrierView,
		'explosion' : ExplosionView,
		'life' : LifeView
	};

	var GameView = Backbone.View.extend({
  
		events: {
			"keyup": "control",
			"keydown": "control"
		},
		
		template: GameTemplate,
		
		initialize: function(opts) {
			//array of all the sub viewa
			this.views = [];
			
			//render the game template
			this.render();

			//when a new element is added to the game collection, create a corresponding view
			this.collection.on('add', this.addView, this);
						
			this.collection.on('change', this.renderViews, this);

			//this view needs a socket reference as it handles keypresses
			this.socket = opts.socket;

		},	
				
		addView: function(model) {	

			//create the relevant view, passing the model data
			var view = new ELEMENTS[model.get('type')]({
				'model': model
			});
			
			//append the new element to the game
			this.$game.append(view.$el);
			
			//and drop it in the array for rendering
			this.views.push(view);
		},
		
		render: function() {
		
			this.$el.find('#wrapper').html(_.template(this.template));

			//hold a reference to game bounds element
			this.$game = this.$el.find("#game");
		},
		
		renderViews: function() {
			//loop through and render each view
			_.each(this.views, function(view){
				view.render();
			})
		},
		
		control: function( evt ) {
			//keyboard hijacking for controls	
			var isKeydown = (evt.type === 'keydown') ? true : false;		
			switch(evt.which) {
				case 38: //up
					if(isKeydown) {
						this.socket.emit('tank:move', '1');
					} else { 
						this.socket.emit('tank:move', null);
					}
					evt.preventDefault();
				break;
				case 40: //down
					if(isKeydown) {
						this.socket.emit('tank:move', '-1');
					} else {
						this.socket.emit('tank:move', null);
					}
					evt.preventDefault();
				break;
				case 37: //rotate left
					if(isKeydown) {
						this.socket.emit('tank:rotate', '-1');
					} else {
						this.socket.emit('tank:rotate', null);
					}
					evt.preventDefault();
				break;
				case 39: //rotate right
					if(isKeydown) {
						this.socket.emit('tank:rotate', '1');
					} else {
						this.socket.emit('tank:rotate', null);
					}
					evt.preventDefault();
				break;
				case 32: //spacebar
					if(!isKeydown) {
						console.log('shoot');
						this.socket.emit('tank:shoot', true);
					}
					evt.preventDefault();
				break;
			}
		}

	});
  
	return GameView;

});
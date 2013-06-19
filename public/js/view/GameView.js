define([
	'underscore',
	'backbone',
	'collection/ClientCollection',
	'view/BattleView',
	'view/GameOverView',
	'view/QueueView',
	'text!template/GameTemplate.html'
], function(_, Backbone, ClientCollection, BattleView, GameOverView, QueueView, GameTemplate){

	var GameView = Backbone.View.extend({
  
		events: {
			"keyup": "control",
			"keydown": "control"
		},
		
		template: GameTemplate,
		
		initialize: function(opts) {

			//this view needs a socket reference as it handles keypresses
			this.socket = opts.socket;

			this.collection = new ClientCollection();
			
			//render the game template
			this.render();

			this.queueModel = new Backbone.Model();

			this.battleView = new BattleView({
				'el': '#game',
				'socket': this.socket,
				'collection': this.collection
			});
			
			this.queueView = new QueueView({
				'el': '#game-queue',
				'model': this.queueModel
			});

			this.gameOverView = new GameOverView({
				'el': '#game-over',
			});

			this.socket.on('queue:change', $.proxy(this.queueModel.set, this.queueModel));
			
			this.socket.on('game:start', $.proxy(this.collection._set, this.collection));			
			this.socket.on('game:frame', $.proxy(this.collection._set, this.collection));
			this.socket.on('game:remove', $.proxy(this.collection.remove, this.collection));

			this.socket.on('game:over', $.proxy(this.battleView.remove, this.battleView));
			this.socket.on('game:over', $.proxy(this.gameOverView.render, this.gameOverView));
			this.socket.on('game:start', $.proxy(this.queueView.remove, this.queueView));
		},	
						
		render: function() {
		
			this.$el.find('#wrapper').html(_.template(this.template));
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
						this.socket.emit('tank:shoot', true);
					}
					evt.preventDefault();
				break;
			}
		}

	});
  
	return GameView;

});
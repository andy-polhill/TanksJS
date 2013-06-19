define([
	'underscore',
	'backbone',
	'view/TankView',
	'view/BarrierView',
	'view/BulletView',
	'view/ExplosionView',
	'view/LifeView'
], function(_, Backbone, TankView, BarrierView, BulletView, ExplosionView, LifeView){

	//type => constructor lookup
	var ELEMENTS = {
		'bullet' : BulletView,
		'tank' : TankView,
		'barrier' : BarrierView,
		'explosion' : ExplosionView,
		'life' : LifeView
	};

	var BattleView = Backbone.View.extend({
		
		initialize: function(opts) {
			//array of all the sub viewa
			this.views = [];
			
			this.canvas = this.$el[0];
			this.ctx = this.canvas.getContext("2d");
			
			//when a new element is added to the game collection, create a corresponding view
			this.collection.on('add', this.addView, this);
						
			this.collection.on('change', this.render, this);

			//this view needs a socket reference as it handles keypresses
			this.socket = opts.socket;

		},	
				
		addView: function(model) {	

			//create the relevant view, passing the model data
			var view = new ELEMENTS[model.get('type')]({
				'model': model,
				'ctx': this.ctx
			});
			
			//append the new element to the game
			this.$el.append(view.$el);
			
			//and drop it in the array for rendering
			this.views.push(view);
		},
		
		render: function() {
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.ctx.beginPath();
			//loop through and render each view
			_.each(this.views, function(view){
				view.render();
			});
			this.ctx.closePath();
			this.ctx.stroke();			
		},

	});
  
	return BattleView;

});
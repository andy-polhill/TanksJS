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
			this.views = {};
			
			this.canvas = this.$el[0];
			this.ctx = this.canvas.getContext("2d");
			
			//when a new element is added to the game collection, create a corresponding view
			this.collection.on('add', this.addView, this);
			this.collection.on('remove', this.removeView, this);

			_.bind(this.render, this);

			//this view needs a socket reference as it handles keypresses
			this.socket = opts.socket;
		},	
				
		addView: function(model) {	

			//create the relevant view, passing the model data
			var view = new ELEMENTS[model.get('type')]({
				'model': model,
				'ctx': this.ctx
			});
						
			//and drop it in the array for rendering
			this.views[model.get('id')] = view;
		},
		
		removeView: function(model) {
						
			delete this.views[model.get('id')];
		},
				
		render: function() {
			requestAnimationFrame(_.bind(this.render, this));
			// Drawing code goes here
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			//loop through and render each view
			_.each(_.keys(this.views), function(key){
				this.views[key].render();
			}, this);		
		}

	});
  
	return BattleView;

});
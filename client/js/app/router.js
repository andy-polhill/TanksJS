// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'view/TankView',
  'model/TankModel'
], function($, _, Backbone, TankView, TankModel){

  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      '*path': 'play'
    },
    
    play: function() {    
		var tank = new TankView({
			el: 'body'
		});
    }    
  });

  var initialize = function(){

    var app_router = new AppRouter;
    Backbone.history.start();
  };
  
  return {
    initialize: initialize
  };
});
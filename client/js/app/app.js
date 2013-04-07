// Filename: app.js
define([
  'jquery',
  'underscore',
  'backbone',
  'router', // Request router.js
], 
function($, _, Backbone, Router){
  var initialize = function(){
    // Pass in our Router module and call it's initialize function
    Router.initialize();
  }

  return {
    initialize: initialize
  };
});

	
/*
var socket = io.connect('http://localhost');
socket.on('frame', function (data) {
	console.log(data);
	socket.emit('my other event', { my: 'data' });
});


$("body").keydown(function(evt) {
	switch(evt.which) {
		
		case 37:
			//left
			socket.emit('move', { x: -1 });
			break;
		case 38:
			//up
			socket.emit('move', { y: 1 });
			break;
		case 39:
			//right
			socket.emit('move', { x: 1 });
			break;
		case 37:
			//down
			socket.emit('move', { y: -1 });
			break;
	}
});*/

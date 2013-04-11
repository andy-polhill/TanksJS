require.config({
	baseUrl: "client/js/app",
	paths: {
		jquery: "//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery",
		underscore: "/client/js/lib/underscore",
		backbone: "/client/js/lib/backbone",
		io: "/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io"
	}
});


require(['io', 'router'], function(io, AppRouter){

	var socket = io.connect('/');
    
    var router = new AppRouter({
    	'socket' : socket
    });
    
    Backbone.history.start();

});

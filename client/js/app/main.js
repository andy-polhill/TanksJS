require.config({
	baseUrl: "client/js/app",
	paths: {
		jquery: "//ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery",
		underscore: "/client/js/lib/underscore",
		backbone: "/client/js/lib/backbone",
		"sockets.io": "/node_modules/socket.io/node_modules/socket.io-client/dist/socket.io"
	}
});


require(['app'], function(App){
  // The "app" dependency is passed in as "App"
  App.initialize();
});

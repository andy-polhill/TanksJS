require.config({
	baseUrl: "/js",
	paths: {
		jquery: "lib/jquery",
		underscore: "lib/underscore",
		backbone: "lib/backbone",
		text: "lib/text",
		io : "/socket.io/socket.io",
		template: "../../template"
	}
});

require(['io', 'router/router'], function(io, AppRouter){

	//var socket = io.connect();
	var socket = io.connect('/', {'force new connection':true});
    
    var router = new AppRouter({
    	'socket' : socket
    });
    
    Backbone.history.start();
});
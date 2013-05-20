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

require(['router/router'], function(AppRouter){
   
    var router = new AppRouter();

	//globally scoped event aggregator
	Vents = _.extend({}, Backbone.Events);
	
	Vents.bind("select:tank", function( args ){
		router.navigate("play/" + args.variant, {trigger: true});
	});
    
    Backbone.history.start();
});
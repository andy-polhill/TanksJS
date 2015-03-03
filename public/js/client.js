require.config({
	baseUrl: "/js",
	paths: {
		jquery: "lib/jquery",
		underscore: "lib/underscore",
		backbone: "lib/backbone",
		text: "lib/text",
		template: "../template",
		polyfill: 'lib/polyfill'
	}
});

require(['router/router', 'polyfill'], function(AppRouter, polyfill){

	//globally scoped event aggregator
	Vents = _.extend({}, Backbone.Events);

  var router = new AppRouter();

	Vents.bind("select:room", function( args ){
		router.navigate("rooms/" + args.room + "/tanks", {trigger: true});
	});

	Vents.bind("select:tank", function( args ){
		router.navigate(document.location.hash + "/" + args.variant, {trigger: true});
	});

	Vents.bind("game:over", function( args ){
		router.navigate("/", {trigger: true});
	});

    Backbone.history.start();
});

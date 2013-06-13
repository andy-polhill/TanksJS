require.config({
	baseUrl: "/js",
	paths: {
        'bootstrap': ['//netdna.bootstrapcdn.com/twitter-bootstrap/2.2.1/js/bootstrap.min', 'libs/bootstrap-min'],
		jquery: "lib/jquery",
		underscore: "lib/underscore",
		backbone: "lib/backbone",
		text: "lib/text",
		template: "../template"
	},
	shim: {
        "bootstrap": ["jquery"]
    }
});

require(['router/router', 'jquery', 'bootstrap'], function(AppRouter, $){

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
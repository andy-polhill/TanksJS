var requirejs = require('requirejs')
,	express = require('express')
, app = express()
,	http = require('http').Server(app)
,	package = require('../package.json')
,	jade = require('jade')
,	io = require('socket.io')(http);

app.locals.basedir = __dirname;
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

var config = {
	port: '8081'
};

/*io.configure('production', function(){
	console.log("production sockets config");
	io.set('transports', ['flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
	io.enable('browser client minification');  // send minified client
	io.enable('browser client etag');          // apply etag caching logic based on version number
	io.enable('browser client gzip');          // gzip the file
	io.disable('flash policy server');          // no websockets, so try flashsocket
	io.set('log level', 1);                    // reduce logging
});*/

//io.configure('development', function(){
//	console.log("development sockets config");
//	io.set('transports', ['flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
//	io.set('log level', 3);
//});

console.log("==== %s %s ====", package.name, package.version);

requirejs.config({
  baseUrl: __dirname + '/js',
  nodeRequire: require
});

app.use(express.static(__dirname));

http.listen(config.port, function () {
  console.log('Express server listening on port %d in %s mode', config.port, app.get('env'));
});

requirejs(["GameController"], function(GameController) {
	GameController.start({
		'package': package,
		'app': app,
		'io': io
	});
});

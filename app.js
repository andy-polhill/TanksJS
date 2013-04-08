var express = require('express'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server);

server.listen(8080);
//app.listen(8080);
app.use(express.static(__dirname + '/'));
//app.use('node', express.static(__dirname + '/node_modules'));

console.log('Listening on port 8080');

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

var tank = {
	move : false,
	angle : 0,
	position : {
		left : 0,
		top : 0
	}
};

io.sockets.on('connection', function (socket) {
	
	//TODO: this will have to be uber efficient eventually.
	setInterval(function(){
		if(tank.move) {
			var radians = tank.angle * (Math.PI/180),
				cos = Math.cos(radians);
				sin = Math.sin(radians);
			tank.position.left += - (cos).toFixed(1);
			tank.position.top += - (sin).toFixed(1);
		}
		socket.emit('frame', tank);		
	},100)
	
	socket.emit('frame', tank);		
	
	socket.on('move', function (move) {
		tank.move = move;
	});
	
	socket.on('angle', function (angle) {
		tank.angle = angle;
	});
});
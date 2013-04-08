//TODO: This is all currently very crude

var express = require('express'),
	http = require('http'),
	app = express(),
	server = http.createServer(app),
	io = require('socket.io').listen(server);

server.listen(8080);
app.use(express.static(__dirname + '/'));
//app.use('node', express.static(__dirname + '/node_modules'));

console.log('Listening on port 8080');

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

var tank = {
	move : false,
	rotate : null,
	velocity : 1.5,
	position : {
		angle : 0,
		left : 0,
		top : 0
	}
};

io.sockets.on('connection', function(socket) {
	
	//TODO: this will have to be uber efficient eventually.
	var frameInterval = setInterval(function(){
		if(tank.move) {
			var radians = tank.position.angle * (Math.PI/180),
				cos = Math.cos(radians);
				sin = Math.sin(radians);
			tank.position.left = (tank.position.left - (tank.velocity * cos)).toFixed(2);
			tank.position.top = (tank.position.top - (tank.velocity * sin)).toFixed(2);
		}
		socket.emit('frame', tank);		
	},100)
	
	var rotateInterval = null;
	
	socket.emit('frame', tank);		
	
	socket.on('move', function (move) {
		tank.move = move;
	});
	
	socket.on('rotate', function (direction) {

		tank.rotate = direction;

		console.log('rotate : ' + direction);

			var rotateFunc = function( alteration ) {

				tank.position.angle += alteration;
				if(tank.position.angle > 360) {
					tank.position.angle = 0;
				}
				if(tank.position.angle < 0) {
					tank.position.angle = 360;
				}
				console.log('rotate interval: ' + tank.position.angle);
			}
	
		switch(direction) {
			case "left":
				if(rotateInterval === null) {
					console.log('start left rotation');
					rotateInterval = setInterval(rotateFunc, 100, -5);
				}
				break;
			case "right":
				if(rotateInterval === null) {
					console.log('start right rotation');
					rotateInterval = setInterval(rotateFunc, 100, 5);
				}			
				break;
			default:
				console.log('end rotation : ' + rotateInterval);
				clearInterval( rotateInterval );
				rotateInterval = null;	
		}
	});
});
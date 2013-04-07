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
	position : {
		left : 0,
		top : 0
	}
};

io.sockets.on('connection', function (socket) {
	
	setInterval(function(){
		if(tank.move) {
			tank.position.left += 1;
			tank.position.top += 1;		
		}
		socket.emit('frame', tank);		
	},100)
	
	socket.emit('frame', tank);		
	
	socket.on('move', function (move) {
		tank.move = move;
	});
});
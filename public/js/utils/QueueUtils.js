define([
	'underscore'
	],

	function( _ ) {
		
	var MAX_PLAYERS = 2;
		
	return {
		
		updateQueue: function(clients) {
			
			var queueJSON = {
				'size': _.size(clients) - MAX_PLAYERS, //size of queue
				'players': Math.min(_.size(clients), MAX_PLAYERS) //current platers
			};
			
			//keep each client up to date with queue information
			_.each(clients, function(client) {

				//determine specific sockets location in queue
				queueJSON['position'] = _.indexOf(clients, client)- MAX_PLAYERS + 1, 
				
				console.log("ID: %s POSITION %s", client.id, queueJSON['position']);

				//console.log(queueJSON);		
				client.emit('queue:change', queueJSON);
			});
		},
		
		pushToLast: function(clients, socket) {
						
			debugger;
						
			var pos = _.indexOf(clients, socket);
			clients.push(clients.splice(pos,1)[0]);
			
			return clients;
		},
		
		queueHasSpace: function(clients, socket) {

			console.log("queue space: " + _.indexOf(clients, socket));

			if(_.indexOf(clients, socket) <= MAX_PLAYERS) {
				return true;
			} else {
				//session can not be created as user is too far up the queue
				socket.emit('queue:jump');
				return false;
			}
		}
	}
});

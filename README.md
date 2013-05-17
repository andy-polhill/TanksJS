https://thatguynamedandy.eu01.aws.af.cm/

This is still very much in the alpha development phase, so expect downtime and lots of change.

Currently hosted on appfog, however sockets reverts to short polling, I'm not sure that sockets is fully implemented on appfog yet.

Also it probably won't work on IE, one day I will look at that. Generally it isn't very mobile friendly either, but I may be able to work on that. 

[![Build Status](https://travis-ci.org/thatguynamedandy/playground.png)](https://travis-ci.org/thatguynamedandy/playground)

TODO
====
* Load Testing and Performance Improvements
* Rationalising, Rationalising and more Rationalising 
* Styling
* Queueing system
* IE Support (I suppose)
* Mobile(?) / Tablet support
* Different Tanks
	* Different power weapons 
* Different Rooms
* Optimise Build
* Come up with a way to slow fire rate - done 17/05
* Power Ups - done 17/05

BUGS
====

* Collision Detection thrown errors
* Ghost tanks (close connections on restart)
* Element widths in both css and model data
* Only publish relevant properties to the client
* Decimal places on pixel coordinates - done 16/05
* Deadzone near game borders -  done 17/05
* Life blocks should be more granular - done 17/05
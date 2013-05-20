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
* Different Rooms
* Optimise Build

BUGS
====
* Re-routing creates clone
* Collision Detection thrown errors
* Ghost tanks (close connections on restart)
* Element widths in both css and model data
* Only publish relevant properties to the client
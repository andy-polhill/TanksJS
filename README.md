https://thatguynamedandy.eu01.aws.af.cm/

This is still very much in the alpha development phase, so expect downtime and lots of change.

Currently hosted on appfog, however sockets reverts to short polling, I'm not sure that sockets is fully implemented on appfog yet.

[![Build Status](https://travis-ci.org/thatguynamedandy/playground.png)](https://travis-ci.org/thatguynamedandy/playground)

TODO
====
* Health power ups not working properly
* Register domain name
* Add controls view to design
* Ghost Tanks again!!
* Element Collection could be tidier
* Explosions really slow things down (smaller ones for bullets)
* Collision Detection performance
* Tank Inheritance a bit scrappy
* Global CONSTANTS for element types?
* Router tidy up (before and after navigate)
* Limit sessions to one per IP address
* Bullet location on special tank
* Co-ordinates decimal place, performance issue
* Load Testing and Performance Improvements
* Styling
* Configurable Levels
* More Unit Tests!
* Mobile(?) / Tablet support
* Element widths in both css and model data


Performance Test Results - looped 100000 times
----------------------------------------------
CollisionDetection v1: 13339
CollisionDetection v2: 13080
CollisionDetection v1 without changes loop: 9803
CollisionDetection v2 without changes loop: 10493
CollisionDetection v1 moving tanks: 10439
CollisionDetection v2 moving tanks: 12110

Detect (old) 13532, 13794, 13570
Detect 2 (new) 12084, 11711, 11993
Detect 2 (new) 
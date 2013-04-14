var _ = require('underscore'),
	define = require('amdefine')(module);

define(function(require) {
		
	return {
		
		//TODO: Optimise Optimise!!
		//TODO: Implement radial collision detection!
		detect : function(model, collection) {
		
			var y = model.get('y'),
				x = model.get('x'),
				halfHeight = model.get('h') / 2,
				halfWidth = model.get('w') / 2,
				left = x - halfWidth,
				right = x + halfWidth,
				top = y - halfHeight,
				bottom = y + halfHeight,
				id = model.get('id');
		
			_.each(collection, function(candidate) {

				var y = candidate.get('y'),
					x = candidate.get('x'),
					cHalfHeight = candidate.get('h') / 2,
					cHalfWidth = candidate.get('w') / 2,
					cLeft = x - cHalfWidth,
					cRight = x + cHalfWidth,
					cTop = y - cHalfHeight,
					cBottom = y + cHalfHeight,
					cid = candidate.get('id');

				//console.log("candidate left %d right %d top %d bottom %d", cLeft, cRight, cTop, cBottom)
				//console.log(!(left > cRight))
				//console.log(!(cLeft > right))
				//console.log(!(top > cBottom))
				//console.log(!(cTop > bottom))
				if(!(left > cRight || cLeft > right || top > cBottom || cTop > bottom || id === cid) && _.isFunction(model.collide)) {
					model.collide.call(model, candidate);
					candidate.collide.call(candidate, model);
				}
			})
		}		
	}
	
	return CollisionDetection;
});

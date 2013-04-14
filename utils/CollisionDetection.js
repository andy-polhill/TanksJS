var _ = require('underscore'),
	define = require('amdefine')(module);

define(function(require) {
		
	return {
		
		//TODO: Optimise Optimise!!
		//TODO: Implement radial collision detection!
		detect : function(model, collection) {
		
			var originTop = model.get('top'),
				originLeft = model.get('left'),
				halfHeight = model.get('height') / 2,
				halfWidth = model.get('width') / 2,
				left = originLeft - halfWidth,
				right = originLeft + halfWidth,
				top = originTop - halfHeight,
				bottom = originTop + halfHeight,
				id = model.get('id');
		
			_.each(collection, function(candidate) {

				var cOriginTop = candidate.get('top'),
					cOriginLeft = candidate.get('left'),
					cHalfHeight = candidate.get('height') / 2,
					cHalfWidth = candidate.get('width') / 2,
					cLeft = cOriginLeft - cHalfWidth,
					cRight = cOriginLeft + cHalfWidth,
					cTop = cOriginTop - cHalfHeight,
					cBottom = cOriginTop + cHalfHeight,
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

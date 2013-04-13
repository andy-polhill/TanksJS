var _ = require('underscore'),
	define = require('amdefine')(module);

define(function(require) {
		
	return {
		
		//TODO: Optimise Optimise!!
		//TODO: And also account for angle!
		detect : function(model, collection) {
		
			var originTop = model.get('top'),
				originLeft = model.get('left'),
				halfHeight = model.get('height') / 2,
				halfWidth = model.get('width') / 2,
				left = originLeft - halfWidth,
				right = originLeft + halfWidth,
				top = top + halfHeight,
				bottom = top - halfHeight,
				id = model.get('id');
		
			_.each(collection, function(candidate) {

				var cOriginTop = candidate.get('top'),
					cOriginLeft = candidate.get('left'),
					cHalfHeight = candidate.get('height') / 2,
					cHalfWidth = candidate.get('width') / 2,
					cLeft = cOriginTop - cHalfWidth,
					cRight = cOriginLeft + cHalfWidth,
					cTop = cOriginTop + cHalfHeight,
					cBottom = cOriginLeft - cHalfHeight,
					cid = candidate.get('id');

				if(!(left > cRight || cLeft > right || top > cBottom || cTop > bottom || id === cid) && _.isFunction(model.collide)) {
					model.collide.call(model, candidate);
					candidate.collide.call(candidate, model);
				}
			})
		}		
	}
	
	return CollisionDetection;
});

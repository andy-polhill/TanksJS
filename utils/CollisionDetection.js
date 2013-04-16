var _ = require('underscore'),
	define = require('amdefine')(module);

define(function(require) {
		
	return {
		
		//TODO: Optimise Optimise!!
		//TODO: Implement radial collision detection!
		detect : function(model, collection, opts) {
		
			var opts = (typeof opts === "undefined") ? {} : opts;
		
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

				/*console.log("left %d > cRight %d = ", left, cRight, (left > cRight));
				console.log("cLeft %d > right %d = ", cLeft, right, (cLeft > right));
				console.log("top %d > cBottom %d = ", top, cBottom, (top > cBottom));
				console.log("cTop %d > bottom %d = ", cTop, bottom, (cTop > bottom));
				console.log("id %d === cid %d", id, cid, (id === cid));
				console.log(!(left > cRight || cLeft > right || top > cBottom || cTop > bottom || id === cid));*/

				var outcome = !(left > cRight || cLeft > right || top > cBottom || cTop > bottom || id === cid);
				
				if((opts.invert === true && !outcome) || (opts.invert !== true && outcome)) {
					if(_.isFunction(model.collide)) {
						model.collide.call(model, candidate);
					}
					if(_.isFunction(candidate.collide)) {
						candidate.collide.call(candidate, model);
					}
				}
			});
		}
	}

});

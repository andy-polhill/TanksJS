define(['underscore'], function( _ ) {
		
	return {
		
		position: function(model, models, bounds) {

			var maxX = bounds.get('w'),
				maxY = bounds.get('h');

			//keep relocating something until you find an empty place
			while(this.detect(model, models) === true) {
				model.set({
					'x': _.random(0, maxX),
					'y': _.random(0, maxY),
				}, {
					'silent': true
				});
			}
		},
		
		//TODO: Optimise Optimise!!
		//TODO: Implement radial collision detection!
		detect : function(model, collection, opts) {
		
			var opts = (typeof opts === "undefined") ? {} : opts,
				hasIntersect = false;
			
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

				var cid = candidate.get('id');
				
				if(id === cid) return; //don't compare the same object with itself
				
				var y = candidate.get('y'),
					x = candidate.get('x'),
					cHalfHeight = candidate.get('h') / 2,
					cHalfWidth = candidate.get('w') / 2,
					cLeft = x - cHalfWidth,
					cRight = x + cHalfWidth,
					cTop = y - cHalfHeight,
					cBottom = y + cHalfHeight;

				var outcome = !(left > cRight || cLeft > right || top > cBottom || cTop > bottom);
				
				if((opts.invert === true && !outcome) || (opts.invert !== true && outcome)) {
					if(!hasIntersect) {
						hasIntersect = true;
					}				
					if(_.isFunction(model[opts.callback])) {
						model[opts.callback].call(model, candidate);
					}
					if(_.isFunction(candidate[opts.callback])) {
						candidate[opts.callback].call(candidate, model);
					}
				}
			});
			
			return hasIntersect
		}
	}
});


/*console.log("left %d > cRight %d = ", left, cRight, (left > cRight));
console.log("cLeft %d > right %d = ", cLeft, right, (cLeft > right));
console.log("top %d > cBottom %d = ", top, cBottom, (top > cBottom));
console.log("cTop %d > bottom %d = ", cTop, bottom, (cTop > bottom));
console.log("id %d === cid %d", id, cid, (id === cid));
console.log(!(left > cRight || cLeft > right || top > cBottom || cTop > bottom || id === cid));*/

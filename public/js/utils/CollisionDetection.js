define(['underscore'], function( _ ) {
		
	return {
		
		position: function(model, models, bounds) {

			var maxX = bounds.get('w'),
				maxY = bounds.get('h');

			//keep relocating something until you find an empty place
			while(this.detect(model, models) === true) {
				
				//FIXME using the 'set' method seems to locks hasChanged at true
				//use underlying attributes for the time being.
				model.attributes['x'] = _.random(0, maxX);
				model.attributes['y'] = _.random(0, maxY);
			};
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

					/*	I have an outstanding issue here, if the candidate is destroyed in the first callback,
						it may cause issues in the second. The way round it is probably to defer the deletion
						until the next frame. The temp quick fix I have attempted is a simple try catch.										
					*/

					if(!hasIntersect) {
						hasIntersect = true;
					}				
					if(_.isFunction(candidate[opts.callback])) {
						candidate[opts.callback].call(candidate, model);
					}
					if(_.isFunction(model[opts.callback])) {
						model[opts.callback].call(model, candidate);
					}
				}
			});

			return hasIntersect
		}
	}
});

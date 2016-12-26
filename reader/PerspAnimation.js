
function perspectiveAnimation(id, span, type, clock, persp1, persp2) {
	this.id = id;
	this.span = span;
	this.type = type;
	this.clock = clock;
	this.persp1 = persp1;
	this.persp2 = persp2;
	this.currPersp = persp1.clone();
	
	this.onhold = true;
	this.backwards = false;

	var persp1_from = this.persp1.getFromPosition();
	var persp2_from = this.persp2.getFromPosition();

	this.startang = -1 * Math.atan2(persp1_from[2], persp1_from[0]);

	if (clock === false) {
		this.rotang = 180;
	} else {
		this.rotang = -180;
	}

	var distance = Math.sqrt(
		(persp2_from[0] - persp1_from[0]) * (persp2_from[0] - persp1_from[0]) +
		(persp2_from[1] - persp1_from[1]) * (persp2_from[1] - persp1_from[1]) +
		(persp2_from[2] - persp1_from[2]) * (persp2_from[2] - persp1_from[2]));

	this.radius = distance / 2;

	var center = [(persp1_from[0] + persp2_from[0]) / 2,
		(persp1_from[1] + persp2_from[1]) / 2,
		(persp1_from[2] + persp2_from[2]) / 2
	];

	this.center = center.slice(0);
	// set animation
	this.animation = new MyCircularAnimation(null, this.span, this.type, this.center, this.radius, this.startang, this.rotang);
}

perspectiveAnimation.prototype.update = function(currTime) {
	if (this.animation.finalPositionDrawn === false && this.onhold === false) {
		this.animation.update(currTime);

/*		// update current perspective
		//var perspFrom = [0, 0, 0];
		//this.animation.getAbsolutePos(perspFrom);

		var animPosition = this.animation.position.slice(0);
		this.currPersp.from[0] = animPosition[0] + this.center[0];
		this.currPersp.from[1] = animPosition[1] + this.center[1];
		this.currPersp.from[2] = animPosition[2] + this.center[2];
*/
		//this.currPersp.from[0] = perspFrom[0];
		//this.currPersp.from[1] = perspFrom[1];
		//this.currPersp.from[2] = perspFrom[2];
	}
};


perspectiveAnimation.prototype.apply = function(scene) {

	if (this.onhold === false) {
		scene.allowMoveCamera = this.animation.finalPositionDrawn;
		this.onhold = this.animation.finalPositionDrawn;
		scene.setCamera(this.currPersp);
	}
};

perspectiveAnimation.prototype.activate = function() {

	// activate it
	this.onhold = false;

	// but only reset if animation is already over
	if (this.animation.finalPositionDrawn === true) {
		this.reset();
	}
};

perspectiveAnimation.prototype.reset = function() {

	if (this.backwards === false) {
		// reset curr perpsective
		this.currPersp = this.persp2.clone();

		// reset animation
		this.animation = new MyCircularAnimation(null, this.span, this.type, this.center, this.radius, this.startang + 180, this.rotang);

		// set backwards
		this.backwards = true;
	} else {
		// reset curr perpsective
		this.currPersp = this.persp1.clone();

		// reset animation
		this.animation = new MyCircularAnimation(null, this.span, this.type, this.center, this.radius, this.startang, this.rotang);

		// set backwards
		this.backwards = false;
	}

};
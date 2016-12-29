
function perspAnimation(scene, id, span, type, clock, persp1, persp2, first_player) {
	CGFobject.call(this,scene);

	this.id = id;			// animation id
	this.span = span;		// animation span
	this.type = type;		// type of animation
	this.clock = clock;		// animation direction

	this.persp1 = persp1;
	this.persp2 = persp2;
	this.currPersp = persp1.clone();

	this.first = true;
	
	this.ongoing = false;

	var persp1_from = this.persp1.getFromPosition();
	var persp2_from = this.persp2.getFromPosition();

	this.rotang = 180;

	var distance = Math.sqrt(
		(persp2_from[0] - persp1_from[0]) * (persp2_from[0] - persp1_from[0]) +
		(persp2_from[1] - persp1_from[1]) * (persp2_from[1] - persp1_from[1]) +
		(persp2_from[2] - persp1_from[2]) * (persp2_from[2] - persp1_from[2]));

	this.radius = distance / 2;

	this.center = [];
	this.center[0] = (persp1_from[0] + persp2_from[0]) / 2;
	this.center[1] = (persp1_from[1] + persp2_from[1]) / 2;
	this.center[2] = (persp1_from[2] + persp2_from[2]) / 2;

	this.first_player = first_player;
	
	this.animation = new MyCircularAnimation(null, this.span, this.type, this.center, this.radius, this.startang, this.rotang);
}

perspAnimation.prototype.setNextPlayer = function(){
	this.first_player = !this.first_player;
	if(this.rotang == 180)
		this.rotang = -180;
	else this.rotang = 180;
}

perspAnimation.prototype.update = function(currTime) {
	if (this.ongoing === true) {
		if(this.animation.finalPositionDrawn === false){
			this.animation.update(currTime);

			if(this.first_player){
				this.startang = 0;
			} else this.startang = 160;

			var animPosition = this.animation.getCurrentPosition(this.startang);

			this.currPersp.from_x = animPosition[0] + this.center[0];
			this.currPersp.from_z = animPosition[1] + this.center[2];
		}

		this.scene.activateCamera = this.animation.finalPositionDrawn;

		this.scene.setCamera(this.currPersp);
	
		if (this.animation.finalPositionDrawn === true) {
				this.ongoing = false;
				this.animation = new MyCircularAnimation(null, this.span, this.type, this.center, this.radius, this.startang, this.rotang);

		}
	}
};


perspAnimation.prototype.activate = function() {
	this.ongoing = true;
};
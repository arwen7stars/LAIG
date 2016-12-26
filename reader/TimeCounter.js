/**
 * Creates a MyPiece object 
 * Uses two MySemiSphere objects to create a sphere
 */
function TimeCounter(scene, seconds_dec, seconds_uni, minutes_dec, minutes_uni) {
 	CGFobject.call(this,scene);
 	this.seconds_dec = seconds_dec;
 	this.seconds_uni = seconds_uni;

 	this.minutes_dec = minutes_dec;
 	this.minutes_uni = minutes_uni;

 	this.texture_sec_dec;
 	this.texture_sec_uni;
 	this.texture_min_dec;
 	this.texture_min_uni;
 	this.texture_colon = new CGFtexture(this.scene, "./resources/colon.png");
	this.texture_bkg = new CGFtexture(this.scene, "./resources/wood.jpg");

 	this.plane_sec_dec = new MyPlane(this.scene,1,1,10,10);
 	this.plane_sec_uni = new MyPlane(this.scene,1,1,10,10);
 	this.plane_min_dec = new MyPlane(this.scene,1,1,10,10);
 	this.plane_min_uni = new MyPlane(this.scene,1,1,10,10);
 	this.plane_colon = new MyPlane(this.scene,1,1,10,10);

 	this.cube = new MyUnitCubeQuad(this.scene);

 	this.zero = new CGFtexture(this.scene, "./resources/00.png");
	this.one = new CGFtexture(this.scene, "./resources/01.png");
	this.two = new CGFtexture(this.scene, "./resources/02.png");
	this.three = new CGFtexture(this.scene, "./resources/03.png");
	this.four = new CGFtexture(this.scene, "./resources/04.png");
	this.five = new CGFtexture(this.scene, "./resources/05.png");
	this.six = new CGFtexture(this.scene, "./resources/06.png");
	this.seven = new CGFtexture(this.scene, "./resources/07.png");
	this.eight = new CGFtexture(this.scene, "./resources/08.png");
	this.nine = new CGFtexture(this.scene, "./resources/09.png");

 	this.chooseTexture();
 };

TimeCounter.prototype = Object.create(CGFobject.prototype);
TimeCounter.prototype.constructor = TimeCounter;

TimeCounter.prototype.chooseTexture = function () {
	
	if(this.seconds_dec == 0)
 		this.texture_sec_dec = this.zero;
 	else if(this.seconds_dec == 1)
 		this.texture_sec_dec = this.one;
 	else if(this.seconds_dec == 2)
 		this.texture_sec_dec = this.two
 	else if(this.seconds_dec == 3)
 	 	this.texture_sec_dec = this.three;
	else if(this.seconds_dec == 4)
 	 	this.texture_sec_dec = this.four;
 	else if(this.seconds_dec == 5)
 	 	this.texture_sec_dec = this.five;
 	else if(this.seconds_dec == 6)
	 	this.texture_sec_dec = this.six;
	else if(this.seconds_dec == 7)
	  	this.texture_sec_dec = this.seven;
	else if(this.seconds_dec == 8)
	  	this.texture_sec_dec = this.eight;
	else this.texture_sec_dec = this.nine;

	if(this.seconds_uni == 0)
 		this.texture_sec_uni = this.zero;
 	else if(this.seconds_uni == 1)
 		this.texture_sec_uni = this.one;
 	else if(this.seconds_uni == 2)
 		this.texture_sec_uni = this.two;
 	else if(this.seconds_uni == 3)
 	 	this.texture_sec_uni = this.three;
	else if(this.seconds_uni == 4)
 	 	this.texture_sec_uni = this.four;
 	else if(this.seconds_uni == 5)
 	 	this.texture_sec_uni = this.five;
 	else if(this.seconds_uni == 6)
	 	this.texture_sec_uni = this.six;
	else if(this.seconds_uni == 7)
	  	this.texture_sec_uni = this.seven;
	else if(this.seconds_uni == 8)
	  	this.texture_sec_uni = this.eight;
	else this.texture_sec_uni = this.nine;

		if(this.minutes_dec == 0)
 		this.texture_min_dec = this.zero;
 	else if(this.minutes_dec == 1)
 		this.texture_min_dec = this.one;
 	else if(this.minutes_dec == 2)
 		this.texture_min_dec = this.two;
 	else if(this.minutes_dec == 3)
 	 	this.texture_min_dec = this.three;
	else if(this.minutes_dec == 4)
 	 	this.texture_min_dec = this.four;
 	else if(this.minutes_dec == 5)
 	 	this.texture_min_dec = this.five;
 	else if(this.minutes_dec == 6)
	 	this.texture_min_dec = this.six;
	else if(this.minutes_dec == 7)
	  	this.texture_min_dec = this.seven;
	else if(this.minutes_dec == 8)
	  	this.texture_min_dec = this.eight;
	else this.texture_min_dec = this.nine;

	if(this.minutes_uni == 0)
 		this.texture_min_uni = this.zero;
 	else if(this.minutes_uni == 1)
 		this.texture_min_uni = this.one;
 	else if(this.minutes_uni == 2)
 		this.texture_min_uni = this.two;
 	else if(this.minutes_uni == 3)
 	 	this.texture_min_uni = this.three;
	else if(this.minutes_uni == 4)
 	 	this.texture_min_uni = this.four;
 	else if(this.minutes_uni == 5)
 	 	this.texture_min_uni = this.five;
 	else if(this.minutes_uni == 6)
	 	this.texture_min_uni = this.six;
	else if(this.minutes_uni == 7)
	  	this.texture_min_uni = this.seven;
	else if(this.minutes_uni == 8)
	  	this.texture_min_uni = this.eight;
	else this.texture_min_uni = this.nine;

}

TimeCounter.prototype.update = function (seconds_dec, seconds_uni, minutes_dec, minutes_uni) {
	this.seconds_dec = seconds_dec;
	this.seconds_uni = seconds_uni;
	this.minutes_dec = minutes_dec;
	this.minutes_uni = minutes_uni;

	this.chooseTexture();
}

TimeCounter.prototype.display = function () {

	this.scene.pushMatrix();
		this.scene.scale(1,1.5,1);
		this.texture_min_dec.bind(0);
		this.plane_min_dec.display();
		this.texture_min_dec.unbind();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.scale(1,1.5,1);
		this.scene.translate(1,0,0);
		this.texture_min_uni.bind(0);
		this.plane_min_uni.display();
		this.texture_min_uni.unbind();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(1.75,0,0);
		this.scene.scale(0.5,1.5,1);
		this.texture_colon.bind(0);
		this.plane_colon.display();
		this.texture_colon.unbind();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.scale(1,1.5,1);
		this.scene.translate(2.5,0,0);
		this.texture_sec_dec.bind(0);
		this.plane_sec_uni.display();
		this.texture_sec_dec.unbind();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.scale(1,1.5,1);
		this.scene.translate(3.5,0,0);
		this.texture_sec_uni.bind(0);
		this.plane_sec_dec.display();
		this.texture_sec_uni.unbind();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.scale(4.52,1.5,0.5);
		this.scene.translate(0.39,0,-0.51);
		this.texture_bkg.bind(0);
		this.cube.display();
		this.texture_bkg.unbind();
	this.scene.popMatrix();

 };
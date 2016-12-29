/**
 * Creates a MyPiece object 
 * Uses two MySemiSphere objects to create a sphere
 */
function TimeCounter(scene, first_score, second_score) {
 	CGFobject.call(this,scene);
 	this.first_score = first_score;
 	this.second_score = second_score;

 	this.active_player;
 	this.first_player;
 	this.second_player;

 	this.texture_first_score;
 	this.texture_second_score;
	
 	this.texture_colon = new CGFtexture(this.scene, "./resources/colon.png");
	this.texture_bkg = new CGFtexture(this.scene, "./resources/wood.png");
	this.shader = new CGFshader(this.scene.gl, "shaders/shader.vert", "shaders/shader.frag");

 	this.plane_first_score = new MyPlane(this.scene,1,1,10,10);
 	this.plane_second_score = new MyPlane(this.scene,1,1,10,10);
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

 	this.chooseTexture();
 };

TimeCounter.prototype = Object.create(CGFobject.prototype);
TimeCounter.prototype.constructor = TimeCounter;

TimeCounter.prototype.chooseTexture = function () {
	
	if(this.first_score == 0)
 		this.texture_first_score = this.zero;
 	else if(this.first_score == 1)
 		this.texture_first_score = this.one;
 	else if(this.first_score == 2)
 		this.texture_first_score = this.two
 	else if(this.first_score == 3)
 	 	this.texture_first_score = this.three;
	else if(this.first_score == 4)
 	 	this.texture_first_score = this.four;
 	else if(this.first_score == 5)
 	 	this.texture_first_score = this.five;
 	else if(this.first_score == 6)
	 	this.texture_first_score = this.six;
	else if(this.first_score == 7)
	  	this.texture_first_score = this.seven;

		if(this.second_score == 0)
 		this.texture_second_score = this.zero;
 	else if(this.second_score == 1)
 		this.texture_second_score = this.one;
 	else if(this.second_score == 2)
 		this.texture_second_score = this.two;
 	else if(this.second_score == 3)
 	 	this.texture_second_score = this.three;
	else if(this.second_score == 4)
 	 	this.texture_second_score = this.four;
 	else if(this.second_score == 5)
 	 	this.texture_second_score = this.five;
 	else if(this.second_score == 6)
	 	this.texture_second_score = this.six;
	else if(this.second_score == 7)
	  	this.texture_second_score = this.seven;

}

TimeCounter.prototype.update = function (first_score, second_score) {
	this.first_score = first_score;
	this.second_score = second_score;

	this.chooseTexture();
}

TimeCounter.prototype.setPlayers = function(first_player, second_player){
	this.first_player = first_player;
	this.second_player = second_player;

	if(this.first_player == "red"){
		this.color_first = [1.0, 0.0, 0.0, 1.0];
	} else{
		this.color_first = [0.5, 0.5, 0.5, 1.0];
	}

	if(this.second_player == "red"){
		this.color_second = [1.0, 0.0, 0.0, 1.0];
	} else{
		this.color_second = [0.5, 0.5, 0.5, 1.0];
	}
}

TimeCounter.prototype.setActivePlayer = function(curr_player){
	this.active_player = curr_player;
}

TimeCounter.prototype.display = function () {

	if(this.active_player == this.second_player){
		this.scene.setActiveShader(this.shader);
		this.shader.setUniformsValues({c: this.color_second});
	}

	this.scene.pushMatrix();
		this.scene.scale(1.5,1.5,1);
		this.texture_second_score.bind(0);
		this.plane_second_score.display();
		this.texture_second_score.unbind();
	this.scene.popMatrix();

	if(this.active_player == this.second_player){
		this.scene.setActiveShader(this.scene.defaultShader);
	}

	this.scene.pushMatrix();
		this.scene.translate(1.25,0,0);
		this.scene.scale(1,1.5,1);
		this.texture_colon.bind(0);
		this.plane_colon.display();
		this.texture_colon.unbind();
	this.scene.popMatrix();

	if(this.active_player == this.first_player){
		this.scene.setActiveShader(this.shader);
		this.shader.setUniformsValues({c: this.color_first});
	}

	this.scene.pushMatrix();
		this.scene.scale(1.5,1.5,1);
		this.scene.translate(1.65,0,0);
		this.texture_first_score.bind(0);
		this.plane_first_score.display();
		this.texture_first_score.unbind();
	this.scene.popMatrix();

	if(this.active_player == this.first_player){
		this.scene.setActiveShader(this.scene.defaultShader);
		this.end_turn = false;
	}

	this.scene.pushMatrix();
		this.scene.scale(4,1.5,2);
		this.scene.translate(0.31,0,-0.55);
		this.texture_bkg.bind(0);
		this.cube.display();
		this.texture_bkg.unbind();
	this.scene.popMatrix();

 };
function Menu(scene) {
   	CGFobject.call(this,scene);

   	this.mode_selected = false;
   	this.dif_selected = false;
   	this.mode;
   	this.difficulty;
   	this.gameStart = false;

	this.initTextures();

 };

Menu.prototype = Object.create(CGFobject.prototype);
Menu.prototype.constructor = Menu;

Menu.prototype.initTextures = function(){
	this.bkg = new MyPlane(this.scene,10,5,10,10);
 	this.bkg_tex = new CGFtexture(this.scene, "./resources/jp_bkg.jpg");

 	this.menu = new MyPlane(this.scene,3.5,2.5,10,10);
 	this.menu_tex = new CGFtexture(this.scene, "./resources/beige.png");

 	this.pvp = new MyPlane(this.scene,0.6,0.4,10,10);
  	this.pvp_tex = new CGFtexture(this.scene, "./resources/pvp.jpg");

	this.pvai = new MyPlane(this.scene,0.6,0.4,10,10);
  	this.pvai_tex = new CGFtexture(this.scene, "./resources/pvai.jpg");

	this.aivai = new MyPlane(this.scene,0.6,0.4,10,10);
  	this.aivai_tex = new CGFtexture(this.scene, "./resources/aivsai.jpg");

	this.easy = new MyPlane(this.scene,0.6,0.4,10,10);
  	this.easy_tex = new CGFtexture(this.scene, "./resources/easy.jpg");

	this.medium = new MyPlane(this.scene,0.6,0.4,10,10);
  	this.medium_tex = new CGFtexture(this.scene, "./resources/medium.jpg");

	this.difficult = new MyPlane(this.scene,0.6,0.4,10,10);
  	this.difficult_tex = new CGFtexture(this.scene, "./resources/difficult.jpg");

	this.play = new MyPlane(this.scene,1,0.4,10,10);
  	this.play_tex = new CGFtexture(this.scene, "./resources/play.png");
}

Menu.prototype.picking = function (obj, customId) {
	if (obj)
	{			
		console.log("Picked object: " + obj + ", with pick id " + customId);
		
		if(customId == 1 || customId == 2 || customId == 3){
			console.log("MODE SELECTED");
			this.mode_selected = true;
			this.processMode(customId);
		} else if(customId == 4 || customId == 5 || customId == 6){
			console.log("DIFFICULTY SELECTED");
			this.dif_selected = true;
			this.processDiff(customId);
		} else if(customId == 7){
			this.gameStart = true;
		}

	}
	
}

Menu.prototype.processMode = function(mode){
	if(mode == 1){
		this.mode = 0;
	} else if(mode == 2){
		this.mode = 1;
	} else this.mode = 2;

	console.log("MODE " + this.mode);
}

Menu.prototype.processDiff = function(dif) {
	if(dif == 4){
		this.difficulty = 0;
	} else if(dif == 5){
		this.difficulty = 1;
	} else{
		this.difficulty = 2;
	}

	console.log("MODE " + this.difficulty);
}

Menu.prototype.hasGameStarted = function() {
	return this.gameStart;
}

Menu.prototype.getDifficulty = function() {
	return this.difficulty;
}

Menu.prototype.getMode = function(){
	return this.mode;
}


Menu.prototype.display = function () {
	this.scene.logPicking();
	this.scene.clearPickRegistration();
	
	this.scene.pushMatrix();
		this.bkg_tex.bind(0);
		this.bkg.display();
		this.bkg_tex.unbind();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0, 0, 0.01);
		this.menu_tex.bind(0);
		this.menu.display();
		this.menu_tex.unbind();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0, -0.8, 0.02);
		this.play_tex.bind(0);
		if(this.mode_selected && this.dif_selected){
			this.scene.registerForPick(7, this.play);
		}
		this.play.display();
		this.play_tex.unbind();
	this.scene.popMatrix();


	this.scene.pushMatrix();
		this.scene.translate(-0.2, 0.7, 0.02);
		this.pvp_tex.bind(0);
        this.scene.registerForPick(1, this.pvp);
		this.pvp.display();
		this.pvp_tex.unbind();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.5, 0.7, 0.02);
		this.pvai_tex.bind(0);
        this.scene.registerForPick(2, this.pvai);
		this.pvai.display();
		this.pvai_tex.unbind();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(1.2, 0.7, 0.02);
		this.aivai_tex.bind(0);
        this.scene.registerForPick(3, this.aivai);
		this.aivai.display();
		this.aivai_tex.unbind();
	this.scene.popMatrix();




	this.scene.pushMatrix();
		this.scene.translate(-0.2, -0.15, 0.02);
		this.easy_tex.bind(0);
       	this.scene.registerForPick(4, this.easy);
		this.easy.display();
		this.easy_tex.unbind();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0.5, -0.15, 0.02);
		this.medium_tex.bind(0);
		this.scene.registerForPick(5, this.medium);
		this.medium.display();
		this.medium_tex.unbind();
	this.scene.popMatrix();
	
	this.scene.pushMatrix();
		this.scene.translate(1.2, -0.15, 0.02);
		this.difficult_tex.bind(0);
       	this.scene.registerForPick(6, this.difficult);
		this.difficult.display();
		this.difficult_tex.unbind();
	this.scene.popMatrix();
};


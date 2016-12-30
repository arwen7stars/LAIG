/**
 * Creates a MyChessboard object 
 * 
 */

function MyChessboard(scene, du, dv, textureref, su, sv, c1, c2, cs) {
 	CGFobject.call(this,scene);

	this.du = du;
	this.dv = dv;
	this.textureref = textureref;
	this.su = su;
	this.sv = sv;
	this.c1 = c1;
	this.c2 = c2;
	this.cs = cs;

	this.texture = new CGFtexture(this.scene, textureref);

	this.plane = new MyPlane(this.scene,1.5,1.5,this.du,this.dv);

this.shader = new CGFshader(this.scene.gl, "shaders/shader.vert", "shaders/shader.frag");

	this.shader.setUniformsValues({du: this.du});
	this.shader.setUniformsValues({dv: this.dv});

	this.shader.setUniformsValues({c1: this.c1});
	this.shader.setUniformsValues({c2: this.c2});
	this.shader.setUniformsValues({cs: this.cs});

	this.updatePosition();
 };

MyChessboard.prototype = Object.create(CGFobject.prototype);
MyChessboard.prototype.constructor = MyChessboard;

MyChessboard.prototype.setPosition = function (su, sv) {
	this.su = su;
	this.sv = sv;	
};

MyChessboard.prototype.updatePosition = function () {
	this.shader.setUniformsValues({su: this.su});
	this.shader.setUniformsValues({sv: this.sv});
};

MyChessboard.prototype.display = function () {

	 this.scene.pushMatrix();
	 	this.scene.setActiveShader(this.shader);
		this.texture.bind(0);
		this.plane.display();
	this.scene.popMatrix();

 	this.scene.setActiveShader(this.scene.defaultShader);
 
 };
/**
 * Creates a MyPlane object, extension of CGFnurbsObject
 * 
 */

function MyPlane(scene, dimX, dimY, partsX, partsY){
	CGFobject.call(this,scene);
	this.scene = scene;
	this.dimX = dimX;
	this.dimY = dimY;
	this.partsX = partsX;
	this.partsY = partsY;
	this.initBuffers();
};


MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.initBuffers = function () {
	var controlVertexes = [];

	var hDimX = this.dimX / 2;
	var hDimY = this.dimY / 2;

	var controlVertexes = [
						[
							 [-hDimX, -hDimY, 0, 1],
							 [-hDimX,  hDimY, 0, 1]
							
						],
						[
							 [hDimX, -hDimY, 0, 1],
							 [hDimX, hDimY, 0, 1]							 
						]
	];

	this.knots = [];

    for(var i = 0; i <= 1; i++){
    	this.knots.push(0);
    }

    for(var i = 0; i <= 1; i++){
    	this.knots.push(1);
    }

	// degree is 1 for planes (in both directions)
    var surface = new CGFnurbsSurface(1, 1, this.knots, this.knots,  controlVertexes);

   	getSurfacePoint = function(u, v) {
		return surface.getPoint(u, v);
	};

	this.obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsX, this.partsY);
};


MyPlane.prototype.display = function () {
	this.scene.pushMatrix();
		this.obj.display();
	this.scene.popMatrix();
	
};
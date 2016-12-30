/**
 * Creates a MyPatch object, extension of CGFnurbsObject
 * 
 */

function MyPatch(scene, orderU, orderV, partsU, partsV, controlVertexes) {

    CGFobject.call(this, scene);
    this.scene = scene;
    this.orderU = orderU;
    this.orderV = orderV;
    this.partsU = partsU;
    this.partsV = partsV;
    this.controlVertexes = controlVertexes;

    this.initBuffers();

};

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.initBuffers = function () {

    this.knotsU = [];

    for(var i = 0; i <= this.orderU; i++){
    	this.knotsU.push(0);
    }

    for(var i = 0; i <= this.orderU; i++){
    	this.knotsU.push(1);
    }

    this.knotsV = [];

      for(var i = 0; i <= this.orderV; i++){
    	this.knotsV.push(0);
    }

    for(var i = 0; i <= this.orderV; i++){
    	this.knotsV.push(1);
    }


   	var surface = new CGFnurbsSurface(this.orderU, this.orderV, this.knotsU, this.knotsV,  this.controlVertexes);

   	getSurfacePoint = function(u, v) {
		return surface.getPoint(u, v);
	};

	this.obj = new CGFnurbsObject(this.scene, getSurfacePoint, this.partsU, this.partsV);
   
};

MyPatch.prototype.display = function () {
   		this.obj.display();
};
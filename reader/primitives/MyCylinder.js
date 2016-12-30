function MyCylinder(scene, base, top, height, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.alpha = 2*Math.PI/slices;
	this.beta = this.alpha/2;

	this.stacks = stacks;
	this.inc = 1/stacks;

 	this.minS = 0;
 	this.minT = 0;
 	this.maxS = 1;
 	this.maxT = 1;

	this.sIncrease = (this.maxS - this.minS) / slices;
	this.tIncrease = (this.maxT - this.minT) / stacks;

	this.sIncrease = (this.maxS - this.minS) / stacks;
	this.tIncrease = (this.maxT - this.minT) / slices;

 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

MyCylinder.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/



 	this.indices = [];
    for(var i = 0; i < this.slices; i++){
 		for (var j = 0; j < this.stacks; j++) {
			this.indices.push(i*(this.stacks+1)+j);
 			this.indices.push(i*(this.stacks+1)+j+this.stacks+1);
 			this.indices.push(i*(this.stacks+1)+j+1);
 			this.indices.push(i*(this.stacks+1)+j+1);
 			this.indices.push(i*(this.stacks+1)+j+this.stacks+1);
 			this.indices.push(i*(this.stacks+1)+j+this.stacks+2);
 		}
 	}

	this.vertices = [];
    this.normals = [];
    this.texCoords = [];
    var sCoord = this.minT;
 	for (var i = 0; i <= this.slices; i++) {
 		var tCoord = this.minS;
 		for (var j = 0; j <= this.stacks; j++) {
			this.normals.push(Math.cos(this.alpha * i), Math.sin(this.alpha * i), this.inc * j);
			this.vertices.push(Math.cos(this.alpha * i), Math.sin(this.alpha * i), this.inc * j);
			this.texCoords.push(sCoord,tCoord);
			tCoord += this.sIncrease;
		}
		sCoord += this.tIncrease;
	}


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

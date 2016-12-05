/**
 * Creates a MyLamp object 
 * 
 */
 function MyLamp(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.alpha = 2*Math.PI/slices;
	this.beta = this.alpha/2;

	this.stacks = stacks;
	this.inc = Math.PI/2/stacks;
	this.textInc = 1/stacks;

 	this.initBuffers();
 };

 MyLamp.prototype = Object.create(CGFobject.prototype);
 MyLamp.prototype.constructor = MyLamp;

MyLamp.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/

 	this.vertices = [];
 	this.texCoords = [];
 	for (var i = 0; i <= this.slices; i++) {
 		for (var j = 0; j <= this.stacks; j++) {
			this.vertices.push(Math.cos(this.alpha * i)*Math.cos(this.inc*j), Math.sin(this.alpha * i)*Math.cos(this.inc*j), Math.sin(this.inc*j));
 			//this.texCoords.push(0.5 - Math.sin(this.inc*j)*Math.cos(this.alpha * i)/2,0.5 - Math.sin(this.inc*j)*Math.sin(this.alpha * i)/2);
 			//this.texCoords.push(0.5 + Math.sin(this.alpha * i)/2,0.5 - Math.cos(this.alpha * i)/2);
 			//this.texCoords.push(0.5 - this.textInc*Math.cos(this.alpha * i)*j+Math.cos(this.alpha * i)/2,0.5 - this.textInc*j*Math.sin(this.alpha * i)+Math.sin(this.alpha * i)/2);
 			this.texCoords.push(0.5 + Math.cos(this.alpha * i)*Math.cos(this.inc*j)/2, 0.5 + Math.sin(this.alpha * i)*Math.cos(this.inc*j)/2);
 		}
	}
	/*for (var j = 0; j <= this.stacks; j++) {
		for (var i = 0; i <= this.slices; i++) {
			this.texCoords.push(0.5 + Math.sin(this.inc*j)*Math.cos(this.alpha * i)/2,0.5 - Math.sin(this.inc*j)* Math.sin(this.alpha * i)/2);
 		}
	}*/

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


    this.normals = [];
 	for (var i = 0; i <= this.slices; i++) {
 		for (var j = 0; j <= this.stacks; j++) {
			this.normals.push(Math.cos(this.alpha * i)*Math.cos(this.inc*j), Math.sin(this.alpha * i)*Math.cos(this.inc*j), Math.sin(this.inc*j));
 		}
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

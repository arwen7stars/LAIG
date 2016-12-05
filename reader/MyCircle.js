/**
 * MyPrism
 * @constructor
 */
 function MyCircle(scene, slices) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.alpha = 2*Math.PI/slices;
	this.beta = this.alpha/2;

 	this.initBuffers();
 };

 MyCircle.prototype = Object.create(CGFobject.prototype);
 MyCircle.prototype.constructor = MyCircle;

MyCircle.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/



 	this.indices = [];
 	this.vertices = [];
    this.normals = [];

    this.normals.push(0, 0, 1);
	this.vertices.push(0, 0, 0);
    
    for(var i = 0; i < this.slices; i++){
        this.normals.push(0, 0, 1);
		this.vertices.push(Math.cos(this.alpha * i), Math.sin(this.alpha * i), 0);
		this.indices.push(0);
		this.indices.push(i+1);
		this.indices.push(i+2);
    }
	
    this.normals.push(0, 0, 1);
	this.vertices.push(1, 0, 0);
  
 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };

 
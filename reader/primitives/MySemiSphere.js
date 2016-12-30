/**
 * Creates a MySemiSphere object 
 * 
 */
 function MySemiSphere(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.lamp = new MyLamp(this.scene, slices, stacks);

 	this.lamp.initBuffers();
 };

MySemiSphere.prototype = Object.create(CGFobject.prototype);
MySemiSphere.prototype.constructor = MySemiSphere;

MySemiSphere.prototype.display = function () {

 	this.scene.pushMatrix();
		this.lamp.display();
	this.scene.popMatrix();
 };
/**
 * Creates a MySphere object 
 * Uses two MySemiSphere objects to create a sphere
 */
 function MySphere(scene, radius, slices, stacks) {
 	CGFobject.call(this,scene);

 	this.radius = radius;
	this.semiSphere = new MySemiSphere(this.scene, slices, stacks);

 	this.semiSphere.initBuffers();
 };

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;

MySphere.prototype.display = function () {
    var degToRad = Math.PI / 180.0;

 	this.scene.pushMatrix();
 		this.scene.scale(this.radius,this.radius,this.radius);
		this.semiSphere.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.scale(this.radius,this.radius,this.radius);
		this.scene.rotate(180 * degToRad, 1, 0, 0);
		this.semiSphere.display();
	this.scene.popMatrix();
 };
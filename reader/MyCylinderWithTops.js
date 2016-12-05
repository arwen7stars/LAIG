/**
 * MyPrism
 * @constructor
 */
 function MyCylinderWithTops(scene, base, top_arg, height, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.cylinder = new MyCylinder(this.scene, base, top, height, slices, stacks);
	this.top = new MyCircle(this.scene, slices);

 	this.top.initBuffers();
 	this.cylinder.initBuffers();
 };

MyCylinderWithTops.prototype = Object.create(CGFobject.prototype);
MyCylinderWithTops.prototype.constructor = MyCylinderWithTops;

MyCylinderWithTops.prototype.display = function () {

 	this.scene.pushMatrix();
		this.cylinder.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0,0,1);
		this.top.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.scale(1, -1, -1);
		this.top.display();
	this.scene.popMatrix();
 };

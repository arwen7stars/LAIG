function MyTopFloor(scene, type) {
 	CGFobject.call(this,scene);

 	console.log("TYPE " + type);

 	if(type == "red")
 		this.texture = new CGFtexture(this.scene, "./resources/red.jpg");
 	else if (type == "white")
 		this.texture = new CGFtexture(this.scene, "./resources/white.jpg");

	this.patch = new MyPatch(this.scene, 2, 2, 6, 6,[
        [  // U = 0
           // V = 0..2;
            [   0, 0, 1.5, 1 ],
            [-0.5, 0.2, 0.5, 1 ],
            [  -1, 1,   0, 1 ]				
        ],
            // U = 1
            // V = 0..2
        [
            [ 0, 0, 1.5, 1 ],
            [ 0, 0.2, 0.5, 1 ],
            [ 0, 1,   0, 1 ]						 
        ],
           // U = 2
           // V = 0..2
        [					
             [ 0, 0, 1.5, 1 ],
             [ 0.5, 0.2, 0.5, 1 ],
             [ 1,   1,   0, 1 ]
        ]
	]);

	this.plane = new MyPlane(this.scene,2,2,3,3);
	
};

MyTopFloor.prototype = Object.create(CGFobject.prototype);
MyTopFloor.prototype.constructor = MyTopFloor;

MyTopFloor.prototype.display = function () {
    var degToRad = Math.PI / 180.0;
	
	this.scene.pushMatrix();
		this.texture.bind(0);
		this.patch.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	    this.scene.rotate(90 * degToRad, 0, 0, 1);
		this.patch.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	    this.scene.rotate(180 * degToRad, 0, 0, 1);
		this.patch.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	    this.scene.rotate(-90 * degToRad, 0, 0, 1);
		this.patch.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.rotate(180 * degToRad, 0, 1, 0);
		this.plane.display();
		this.texture.unbind(0);
	this.scene.popMatrix();
 };
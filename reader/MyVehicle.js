 function MyVehicle(scene) {
 	CGFobject.call(this,scene);
	
	this.in_appearance = new CGFappearance(this.scene);
	this.out_appearance = new CGFappearance(this.scene);
	this.sail_appearance = new CGFappearance(this.scene);

	this.texture1 = new CGFtexture(this.scene, "./resources/boat.png");
	this.texture2 = new CGFtexture(this.scene, "./resources/sail.png");
	
	this.in_appearance.setTexture(this.texture1);
	this.out_appearance.setTexture(this.texture1);
	this.sail_appearance.setTexture(this.texture2);

	this.in_appearance.setAmbient(0.1,0.1,0.1,1);
	this.in_appearance.setDiffuse(0.1,0.1,0.1,1);
	this.in_appearance.setSpecular(0.1,0.1,0.1,1);


	this.cyl = new MyCylinderWithTops(this.scene,1,1,5,50,50);
	
	this.hull_out = new MyPatch(this.scene, 2, 2, 6, 6,[
        [  // U = 0
           // V = 0..2;
            [ -1.5, 0.005, 1.5, 1 ],
            [ -2.5, 0, 0.5, 1 ],
            [ -2.5, 0, 0, 1 ]				
        ],
            // U = 1
            // V = 0..2
        [
            [ 0, 0,   1.5, 1 ],
            [ 0, 1.5, 0.5, 1 ],
            [ 0, 2, 0, 1 ]						 
        ],
           // U = 2
           // V = 0..2
        [					
             [ 1.5, 0, 1.5, 1 ],
             [ 2.5, 0, 0.5, 1 ],
             [ 2.5, 0, 0, 1 ]
        ]
	]);

	this.hull_in = new MyPatch(this.scene, 2, 2, 6, 6,[
        [  // U = 0
           // V = 0..2;
            [ 1.5, 0,   1.5, 1 ],
            [ 2.5, 0,   0.5, 1 ],
            [ 2.5, 0,   0, 1 ]				
        ],
            // U = 1
            // V = 0..2
        [
            [ 0, 0, 1.5, 1 ],
            [ 0, 1.5, 0.5, 1 ],
            [ 0, 2, 0, 1 ]						 
        ],
           // U = 2
           // V = 0..2
        [					
              [ -1.5, 0,   1.5, 1 ],
              [ -2.5, 0, 	0.5, 1 ],
              [ -2.5, 0,   0, 1 ]
        ]
	]);

	this.triangle_in = new MyTriangle(this.scene,0,0.5,0, 0,0,0.5, 0,0,0);
	this.triangle_out = new MyTriangle(this.scene,0,0.5,0, 0.5,0,0, 0,0,0);

 };

MyVehicle.prototype = Object.create(CGFobject.prototype);
MyVehicle.prototype.constructor = MyVehicle;

MyVehicle.prototype.display = function () {
	var degToRad = Math.PI / 180.0;

 	this.scene.pushMatrix();
 		this.scene.rotate(90 * degToRad, 1, 0, 0);
 		this.out_appearance.apply();
		this.hull_out.display();
		this.in_appearance.apply();
		this.hull_in.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
 		this.scene.rotate(-90 * degToRad, 1, 0, 0);
 		this.scene.rotate(180 * degToRad, 0, 180 * degToRad, 0);
		this.hull_in.display();
		this.out_appearance.apply();
		this.hull_out.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.translate(0, -1.4, 0);
		this.scene.rotate(-90 * degToRad, 1, 0, 0);
		this.scene.scale(0.08,0.08,5.5);
		this.cyl.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.rotate(-90 * degToRad,0,1,0);
		this.scene.rotate(180 * degToRad,0,1,0);
		this.scene.scale(0.03,0.03,2.4);
		this.cyl.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.sail_appearance.apply();
		this.scene.scale(4.5,8,5);
		this.triangle_in.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.scale(4.5,8,5);
		this.triangle_out.display();
	this.scene.popMatrix();


 };
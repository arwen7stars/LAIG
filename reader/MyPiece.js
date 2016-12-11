/**
 * Creates a MyPiece object 
 * Uses two MySemiSphere objects to create a sphere
 */
function MyPiece(scene, n_floors, type) {
 	CGFobject.call(this,scene);
 	this.n_floors = n_floors;
 
	this.floor = new MyTopFloor(this.scene, type);

	this.sphere = new MySphere(this.scene, 1, 30, 30)
 };

MyPiece.prototype = Object.create(CGFobject.prototype);
MyPiece.prototype.constructor = MyPiece;

MyPiece.prototype.display = function () {

	if(this.n_floors <= 3){

		this.scene.pushMatrix();
			this.scene.scale(0.7,0.7,0.5);
			this.floor.display();
		this.scene.popMatrix();

		if(this.n_floors <= 3 && this.n_floors > 1){

			this.scene.pushMatrix();
				this.scene.translate(0, 0, 0.4);
				this.scene.scale(0.5,0.5,0.4);
				this.floor.display();
			this.scene.popMatrix();

			if (this.n_floors == 3){

				this.scene.pushMatrix();
					this.scene.translate(0, 0, 0.8);
					this.scene.scale(0.3,0.3,0.3);
					this.floor.display();
				this.scene.popMatrix();

				this.scene.pushMatrix();
					this.scene.translate(0, 0, 1.4);
					this.scene.scale(0.08,0.08,0.08);
				this.sphere.display();
			this.scene.popMatrix();
			} else{

			this.scene.pushMatrix();
				this.scene.translate(0, 0, 1.2);
				this.scene.scale(0.08,0.08,0.08);
				this.sphere.display();
			this.scene.popMatrix();

			}
		} else{

		this.scene.pushMatrix();
			this.scene.translate(0, 0, 1);
			this.scene.scale(0.08,0.08,0.08);
			this.sphere.display();
		this.scene.popMatrix();

		}
	}
    
 };
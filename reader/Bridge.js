function Bridge(scene) {
 	CGFobject.call(this,scene);

 	this.bridge = new MyPatch(this.scene, 2, 2, 6, 6,[
        [  // U = 0
           // V = 0..2;
            [   0, 0, 2, 1 ],
            [0.5, 0.5, 0.5, 1 ],
            [  1, 1,   0, 1 ]				
        ],
            // U = 1
            // V = 0..2
        [
            [ 0,    0, 2, 1 ],
            [ 0.5, 0.5, 0.5, 1 ],
            [ 1, 1,   1, 1 ]						 
        ],
           // U = 2
           // V = 0..2
        [					
             [ 0,   0,     2, 1 ],
             [ 0.5, 0.5, 0.5, 1 ],
             [ 1,   1,   0, 1 ]
        ]
	]);

 };

Bridge.prototype = Object.create(CGFobject.prototype);
Bridge.prototype.constructor = Bridge;

Bridge.prototype.display = function () {

  this.scene.pushMatrix();
    this.bridge.display();
  this.scene.popMatrix();

    
};
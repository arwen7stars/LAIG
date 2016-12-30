function MyRectangle(scene, x1, y1, x2, y2) {
 	CGFobject.call(this,scene);

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.maxS = 1;
    this.maxT = 1;
    this.minS = 0;
    this.minT = 0;

    this.material;

 	this.initBuffers();
 };

 MyRectangle.prototype = Object.create(CGFobject.prototype);
 MyRectangle.prototype.constructor = MyRectangle;

 MyRectangle.prototype.initBuffers = function() {
 	this.vertices = [
 	this.x1, this.y1, 0,
 	this.x2, this.y1, 0,
 	this.x1, this.y2, 0,
 	this.x2, this.y2, 0
 	];

 	this.indices = [
 	0, 1, 2, 
 	3, 2, 1
 	];
    
    this.normals = [
 	0, 0, 1,
 	0, 0, 1,
 	0, 0, 1,
 	0, 0, 1
 	];

 	this.texCoords = [
    this.maxS, this.maxT,
    this.minS, this.maxT,
    this.maxS, this.minT,
    this.minS, this.minT
    ];

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
/*
 MyRectangle.prototype.updateTex = function(s, t) {
   var dx = (this.x2-this.x1)/s;
   var dy = (this.y2-this.y1)/t;

   this.texCoords = [
   dx, dy,
   this.minT,dy,
   dx,dy,
   this.minS, this.minT
   ];

 };
 */
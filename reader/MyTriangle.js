function MyTriangle(scene,x1,x2,x3,y1,y2,y3,z1,z2,z3)
{
    CGFobject.call(this,scene);
	this.x1=x1;
	this.x2=x2;
	this.x3=x3;
	
	this.y1=y1;
	this.y2=y2;
	this.y3=y3;
	
	this.z1=z1;
	this.z2=z2;
	this.z3=z3;
	
    this.initBuffers();
};
 
MyTriangle.prototype = Object.create(CGFobject.prototype);
MyTriangle.prototype.constructor=MyTriangle;
 
MyTriangle.prototype.initBuffers = function ()
{
    
    this.vertices = [
        this.x1, this.y1, this.z1,
        this.x2, this.y2, this.z2,
        this.x3, this.y3, this.z3
    ];
 
    this.indices = [
        0, 1, 2,
    ];
	
 	var a = Math.sqrt(Math.pow(this.x1-this.x2, 2) + Math.pow(this.y1-this.y2, 2) + Math.pow(this.z1-this.z2, 2));
    var b = Math.sqrt(Math.pow(this.x2-this.x3, 2) + Math.pow(this.y2-this.y3, 2) + Math.pow(this.z2-this.z3, 2));
    var c = Math.sqrt(Math.pow(this.x3-this.x1, 2) + Math.pow(this.y3-this.y1, 2) + Math.pow(this.z3-this.z1, 2));

    var cosA = (-Math.pow(a,2) + Math.pow(b,2) + Math.pow(c,2)) / (2*b*c);
    var cosB = (Math.pow(a,2) - Math.pow(b,2) + Math.pow(c,2)) / (2*c*a);
    var cosC = (Math.pow(a,2) + Math.pow(b,2) - Math.pow(c,2)) / (2*a*b);

    var sinC = Math.sqrt(1- Math.pow(cosC,2));

    this.texCoords = [a-b*cosC, b*sinC,
        0,0,
        a,0];

	
    var vec1 = vec3.fromValues(this.y1 - this.x1, this.y2 - this.x2, this.y3 - this.x3);
    var vec2 = vec3.fromValues(this.z1 - this.y1, this.z2 - this.y2, this.z3 - this.y3);
    var normal = vec3.create();
    vec3.cross(normal, vec1, vec2);
    vec3.normalize(normal, normal);
       
    this.normals = [
                normal[0], normal[1], normal[2],
                normal[0], normal[1], normal[2],
                normal[0], normal[1], normal[2]
    ];
 
    this.primitiveType=this.scene.gl.TRIANGLES;
    this.initGLBuffers();
};
/*

 MyTriangle.prototype.updateTex = function(s, t) {

 	this.a = Math.sqrt(Math.pow(this.x1-this.x3,2)
 			+ Math.sqrt(Math.pow(this.y1-this.y3),2)
 			+ Math.sqrt(Math.pow(this.z1-this.z3),2));
 	
	this.b = Math.sqrt(Math.pow(this.x2-this.x1,2)
 			+ Math.sqrt(Math.pow(this.y2-this.y1),2)
 			+ Math.sqrt(Math.pow(this.z2-this.z1),2));

  	this.c = Math.sqrt(Math.pow(this.x3-this.x2,2)
 			+ Math.sqrt(Math.pow(this.y3-this.y2),2)
 			+ Math.sqrt(Math.pow(this.z3-this.z2),2));

 	this.beta =  Math.acos((a*a - b*b + c*c)/(2*a*c));

 	this.x = a - c*Math.acos(beta);
 	this.y = c*Math.sin(beta);	

 	this.texCoords=[
    0,1,
    this.c,1,
    this.x,1-this.y
  ];

 };
*/
/*

MyTriangle.prototype.updateTex = function(s, t) {
	
   this.texCoords=[
     0,1,
     this.c/s,1,
     this.x/s,(1-this.y)/t
   ];


   this.updateTexCoordsGLBuffers();

 };
 */
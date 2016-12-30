/**
 * Stores light data
 * 
 */
function MyLight(id, enabled) {
    this.id = id;
    this.enabled = enabled;
};

MyLight.prototype.setLocation = function (x, y, z) {
    this.location_x = x;
	this.location_y = y;
	this.location_z = z;
};

MyLight.prototype.setAmbient = function (r, g, b, a) {
	this.ambient_r = r;
	this.ambient_b = g;
	this.ambient_g = b;
	this.ambient_a = a;
};

MyLight.prototype.setDiffuse = function (r, g, b, a) {
	this.diffuse_r = r;
	this.diffuse_b = g;
	this.diffuse_g = b;
	this.diffuse_a = a;
};

MyLight.prototype.setSpecular = function (r, g, b, a) {
	this.specular_r = r;
	this.specular_g = b;
	this.specular_g = g;
	this.specular_a = a;
};

MyLight.prototype.setOmniParam = function (w) {
    this.omni = true;
    this.location_w = w;
};

MyLight.prototype.setSpotParam = function(angle, exponent, x, y, z){
	this.angle = angle;
	this.exponent = exponent;
	this.target_x = x;
	this.target_y = y;
	this.target_z = z;
};
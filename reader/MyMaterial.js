function MyMaterial(id)
{
    this.id = id;
};
 

MyMaterial.prototype.setEmission = function (r, g, b, a) {
    this.emission_r = r;
	this.emission_g = g;
	this.emission_b = b;
	this.emission_a = a;
};

MyMaterial.prototype.setAmbient = function (r, g, b, a) {
	this.ambient_r = r;
	this.ambient_g = g;
	this.ambient_b = b;
	this.ambient_a = a;
};

MyMaterial.prototype.setDiffuse = function (r, g, b, a) {
	this.diffuse_r = r;
	this.diffuse_g = g;
	this.diffuse_b = b;
	this.diffuse_a = a;
};

MyMaterial.prototype.setSpecular = function (r, g, b, a) {
	this.specular_r = r;
	this.specular_g = g;
	this.specular_b = b;
	this.specular_a = a;
};

MyMaterial.prototype.setShininess = function (value) {
    this.shininess = value;
};


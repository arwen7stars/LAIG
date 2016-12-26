function MyPerspective(id, near, far, angle) {
    this.id = id;
    this.near = near;
    this.far = far;
    this.angle = angle;

    this.from_x = 0;
	this.from_y = 0;
	this.from_z = 0;

	this.to_x = 0;
	this.to_y = 0;
	this.to_z = 0;
};

MyPerspective.prototype.setFromPosition = function (x, y, z) {
    this.from_x = x;
	this.from_y = y;
	this.from_z = z;
 };

MyPerspective.prototype.setToPosition = function (x, y, z) {
    this.to_x = x;
    this.to_y = y;
    this.to_z = z;
};

MyPerspective.prototype.getFromPosition = function() {
	return [this.from_x, this.from_y, this.from_z];
}

MyPerspective.prototype.getFromPosition = function() {
	return [this.to_x, this.to_y, this.to_z];
}

MyPerspective.prototype.clone = function() {
  // get ang in degree
	var ang = this.angle * (180 / Math.PI);
	var persp = new MyPerspective(this.id, this.near, this.far, ang);
	persp.setFromPosition(this.from_x, this.from_y, this.from_z);
	persp.setToPosition(this.to_x, this.to_y, this.to_z);

	return persp;
};
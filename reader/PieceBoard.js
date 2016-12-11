/**
 * Creates a MyPiece object 
 * Uses two MySemiSphere objects to create a sphere
 */
function PieceBoard(scene, n_floors, col, lin, size_casa, type) {
 	CGFobject.call(this,scene);
 	this.n_floors = n_floors;
 	this.col = col;
 	this.lin = lin;
 	this.size_casa = size_casa;
 	
	this.piece = new MyPiece(this.scene, n_floors, type);
 };

PieceBoard.prototype = Object.create(CGFobject.prototype);
PieceBoard.prototype.constructor = PieceBoard;

PieceBoard.prototype.movePiece = function(col, lin) {
	this.col = col;
	this.lin = lin;
}

PieceBoard.prototype.getColumn = function() {
	return this.col;
}

PieceBoard.prototype.getLine = function() {
	return this.lin;
}

PieceBoard.prototype.display = function () {

	var scaling_factor = 5/7;

    this.scene.pushMatrix();
    	this.scene.scale(scaling_factor*this.size_casa,scaling_factor*this.size_casa,scaling_factor*this.size_casa);
        this.piece.display();
    this.scene.popMatrix();
	
    
 };
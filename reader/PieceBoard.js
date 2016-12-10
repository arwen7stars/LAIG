/**
 * Creates a MyPiece object 
 * Uses two MySemiSphere objects to create a sphere
 */
function PieceBoard(scene, n_floors, col, lin, type) {
 	CGFobject.call(this,scene);
 	this.n_floors = n_floors;
 	this.col = col;
 	this.lin = lin;
 	
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

    this.scene.pushMatrix();
    	this.scene.scale(0.15,0.15,0.15);
        this.piece.display();
    this.scene.popMatrix();
	
    
 };
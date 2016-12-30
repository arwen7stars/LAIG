function MyBoard(scene, size_casa, first_player) {
 	CGFobject.call(this,scene);

 	this.texture = new CGFtexture(this.scene, "./resources/wood.png");
 	this.shader = new CGFshader(this.scene.gl, "shaders/shader_cell.vert", "shaders/shader_cell.frag");


 	this.size_casa = size_casa;
 	this.first_player = first_player;

 	if(first_player == "red")
 		this.second_player = "white";
 	else if(first_player == "white")
 		this.second_player = "red";

 	this.picking_objects = [];

 	this.first_pieces = [];
 	this.second_pieces = [];

 	var div = 5;

 	for(var i = 0; i < 9; i++){
 	    var line = [];

 	    for(var j = 0; j < 9; j++){
 	        this.plane = new MyPlane(this.scene,size_casa,size_casa,div,div);
 	        line.push(this.plane);
 	     }

 	     this.picking_objects.push(line);
 	}

 	this.setInitialBoard();

 	this.board_array;
 	this.board_string;

 	this.board_array = this.boardToArray();
 	this.board_string = this.boardToString();

 	this.piece_selected = false;

 };

MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor = MyBoard;

MyBoard.prototype.getFirstPlayer = function() {
	return this.first_player;
}

MyBoard.prototype.getSecondPlayer = function() {
	return this.second_player;
}

MyBoard.prototype.getFirstPieces = function () {
	return this.first_pieces;
}

MyBoard.prototype.getSecondPieces = function () {
	return this.second_pieces;
}

MyBoard.prototype.setFirstPieces = function(first_pieces){

	this.first_pieces.splice(0, this.first_pieces.length);


	for(var i = 0; i < first_pieces.length; i++){
		console.log(nfloors + " " + line + " " + column + " " + size_casa + " " + isFirstPlayer);
		var nfloors = first_pieces[i].getNFloors();
		var line = first_pieces[i].getLine();
		var column = first_pieces[i].getColumn();
		var size_casa = first_pieces[i].getSizeCasa();
		var type = first_pieces[i].getType();
		var isFirstPlayer = first_pieces[i].isFirstPiece();
		this.first_pieces[i] = new PieceBoard(this.scene, nfloors, line, column, size_casa, type, isFirstPlayer);
	}
}

MyBoard.prototype.setSecondPieces = function(second_pieces){

	this.second_pieces.splice(0, this.first_pieces.length);

	for(var i = 0; i < second_pieces.length; i++){
		console.log(nfloors + " " + line + " " + column + " " + size_casa + " " + isFirstPlayer);
		var nfloors = second_pieces[i].getNFloors();
		var line = second_pieces[i].getLine();
		var column = second_pieces[i].getColumn();
		var size_casa = second_pieces[i].getSizeCasa();
		var type = second_pieces[i].getType();
		var isFirstPlayer = second_pieces[i].isFirstPiece();
		this.second_pieces[i] = new PieceBoard(this.scene, nfloors, line, column, size_casa, type, isFirstPlayer);
	}
}

MyBoard.prototype.cloneFirstPieces = function(){
	var vec = [];
	for(var i = 0; i < this.first_pieces.length; i++){
		var nFloors = this.first_pieces[i].getNFloors();
		var line = this.first_pieces[i].getLine();
		var column = this.first_pieces[i].getColumn();
		var size_casa = this.first_pieces[i].getSizeCasa();
		var type = this.first_pieces[i].getType();
		var isFirstPlayer = this.first_pieces[i].isFirstPiece();
		vec[i] = new PieceBoard(this.scene, nFloors, line, column, size_casa, type, isFirstPlayer);
	}
	return vec;
}

MyBoard.prototype.cloneSecondPieces = function() {
	var vec = [];
	for(var i = 0; i < this.second_pieces.length; i++){
		var nFloors = this.second_pieces[i].getNFloors();
		var line = this.second_pieces[i].getLine();
		var column = this.second_pieces[i].getColumn();
		var size_casa = this.second_pieces[i].getSizeCasa();
		var type = this.second_pieces[i].getType();
		var isFirstPlayer = this.second_pieces[i].isFirstPiece();
		vec[i] = new PieceBoard(this.scene, nFloors, line, column, size_casa, type, isFirstPlayer);
	}
	return vec;
}

MyBoard.prototype.setSecondPieces = function(second_pieces){
	this.second_pieces = second_pieces;
}

MyBoard.prototype.getPiece = function(col, lin){

	for(var i = 0; i < this.first_pieces.length; i++){
		var lin_piece = this.first_pieces[i].getLine();
		var col_piece = this.first_pieces[i].getColumn();

		console.log("LINHA" + lin_piece + "COL " +  col_piece);

		if((lin_piece == lin) && (col_piece == col)){
			return this.first_pieces[i];
		}
	}

	for(var i = 0; i < this.second_pieces.length; i++){
		var lin_piece = this.second_pieces[i].getLine();
		var col_piece = this.second_pieces[i].getColumn();

		if((lin_piece == lin) && (col_piece == col)){
			return this.second_pieces[i];
		}
	}


}

MyBoard.prototype.getPieceIndex = function(col, lin){

	for(var i = 0; i < this.first_pieces.length; i++){
		var lin_piece = this.first_pieces[i].getLine();
		var col_piece = this.first_pieces[i].getColumn();

		if((lin_piece == lin) && (col_piece == col)){
			return i;
		}
	}

	for(var i = 0; i < this.second_pieces.length; i++){
		var lin_piece = this.second_pieces[i].getLine();
		var col_piece = this.second_pieces[i].getColumn();

		if((lin_piece == lin) && (col_piece == col)){
			return i;
		}
	}
}

MyBoard.prototype.getBoard = function () {
	this.board_array = this.boardToArray();
 	this.board_string = this.boardToString();
	return this.board_string;
}

MyBoard.prototype.setInitialBoard = function () {
	// white = [1,1,1,1, 2,2, 3, 3]
	// linhas - 0 a 8
	// colunas - 1 a 9

	this.first_pieces[0] = new PieceBoard(this.scene, 1, 2, 4, this.size_casa, this.first_player, true);
	this.first_pieces[1] = new PieceBoard(this.scene, 1, 2, 5, this.size_casa, this.first_player, true);
	this.first_pieces[2] = new PieceBoard(this.scene, 1, 2, 6, this.size_casa, this.first_player, true);
	this.first_pieces[3] = new PieceBoard(this.scene, 1, 3, 5, this.size_casa, this.first_player, true);

	this.first_pieces[4] = new PieceBoard(this.scene, 2, 2, 3, this.size_casa, this.first_player, true);
	this.first_pieces[5] = new PieceBoard(this.scene, 2, 2, 7, this.size_casa, this.first_player, true);

	this.first_pieces[6] = new PieceBoard(this.scene, 3, 1, 1, this.size_casa, this.first_player, true);
	this.first_pieces[7] = new PieceBoard(this.scene, 3, 1, 9, this.size_casa, this.first_player, true);

	this.second_pieces[0] = new PieceBoard(this.scene, 1, 8, 4, this.size_casa, this.second_player, false);
	this.second_pieces[1] = new PieceBoard(this.scene, 1, 8, 5, this.size_casa, this.second_player, false);
	this.second_pieces[2] = new PieceBoard(this.scene, 1, 8, 6, this.size_casa, this.second_player, false);
	this.second_pieces[3] = new PieceBoard(this.scene, 1, 7, 5, this.size_casa, this.second_player, false);

	this.second_pieces[4] = new PieceBoard(this.scene, 2, 8, 3, this.size_casa, this.second_player, false);
	this.second_pieces[5] = new PieceBoard(this.scene, 2, 8, 7, this.size_casa, this.second_player, false);

	this.second_pieces[6] = new PieceBoard(this.scene, 3, 9, 1, this.size_casa, this.second_player, false);
	this.second_pieces[7] = new PieceBoard(this.scene, 3, 9, 9, this.size_casa, this.second_player, false);

}

MyBoard.prototype.boardToString = function () {
	board_string = '[';

	for(var i = 0; i < this.board_array.length;i++){
		board_string += '[';

		for(var j = 0; j < this.board_array.length; j++){
			board_string += this.board_array[i][j];
			if(j < this.board_array.length - 1)
				board_string += ',';
		}

		if(i < this.board_array.length - 1){
			board_string += '],';
		}
	}

	return board_string += ']]';
	
}

MyBoard.prototype.boardToArray = function () {

	var board_array = createArray(9,9);
	for(var i = 0; i < 9; i++){
		for(var j = 0; j < 9; j++){
			board_array[i][j] = 'empty';
		}
	}

	for(var i = 0; i < this.first_pieces.length; i++){
		var n_floors = this.first_pieces[i].getNFloors();
		var column = this.first_pieces[i].getColumn()-1;
		var line = this.first_pieces[i].getLine()-1;

		if(n_floors == 3){
			board_array[column][line] = '3-' + this.first_player;
		} else if(n_floors == 2){
			board_array[column][line] = '2-' + this.first_player;
		} else{
			board_array[column][line] = '1-' + this.first_player;
		}
	}

	for(var i = 0; i < this.second_pieces.length; i++){
		var n_floors = this.second_pieces[i].getNFloors();
		var column = this.second_pieces[i].getColumn()-1;
		var line = this.second_pieces[i].getLine()-1;

		if(n_floors == 3){
			board_array[column][line] = '3-' + this.second_player;
		} else if(n_floors == 2){
			board_array[column][line] = '2-' + this.second_player;
		} else{
			board_array[column][line] = '1-' + this.second_player;
		}
	}

	return board_array;
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}



MyBoard.prototype.displayPieces = function () {

	for(i = 0; i < this.first_pieces.length; i++){
		this.scene.pushMatrix();

		var line = this.first_pieces[i].getLine();
		var column = this.first_pieces[i].getColumn();

		this.scene.translate(column*this.size_casa, (line-1)*this.size_casa, -0.01);

		if(!this.piece_selected)
			this.scene.registerForPick(100+i, this.first_pieces[i]);
		else this.scene.registerForPick(10*column+line, this.first_pieces[i]);
		this.first_pieces[i].display();

		this.scene.popMatrix();
	}

	for(i = 0; i < this.second_pieces.length; i++){
		this.scene.pushMatrix();

		var line = this.second_pieces[i].getLine();
		var column = this.second_pieces[i].getColumn();

		this.scene.translate(column*this.size_casa, (line-1)*this.size_casa, -0.01);

		if(!this.piece_selected)
			this.scene.registerForPick(200+i, this.second_pieces[i]);
		else this.scene.registerForPick(10*column+line, this.second_pieces[i]);
		this.second_pieces[i].display();

		this.scene.popMatrix();
	}

	this.board_array = this.boardToArray();
 	this.board_string = this.boardToString();

}


MyBoard.prototype.updatePieceSelected = function (piece_selected) {
	this.piece_selected = piece_selected;
 };

MyBoard.prototype.display = function () {
	var degToRad = Math.PI / 180.0;

	this.displayPieces();
	this.scene.setActiveShader(this.shader);

    for(var i = 0; i < 9; i++){
        this.scene.translate(this.size_casa,0, 0);
        for(var j = 0; j < 9; j++){
            this.scene.pushMatrix();
			this.texture.bind(0);
            this.scene.translate(0, j*this.size_casa,-0.01);
            var tmp = i+1;
            this.scene.registerForPick(10*tmp+j+1, this.picking_objects[i][j]);

            this.picking_objects[i][j].display();
            this.scene.popMatrix();
        }
    }
    this.scene.setActiveShader(this.scene.defaultShader);
 };
function MyBoard(scene, size_casa, first_player) {
 	CGFobject.call(this,scene);

 	this.texture = new CGFtexture(this.scene, "./resources/wood.png");

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

MyBoard.prototype.getBoard = function () {
	return this.board_string;
}

MyBoard.prototype.setInitialBoard = function () {
	// white = [1,1,1,1, 2,2, 3, 3]
	// linhas - 0 a 8
	// colunas - 1 a 9

	this.first_pieces[0] = new PieceBoard(this.scene, 1, 1, 3, this.size_casa, this.first_player, true);
	this.first_pieces[1] = new PieceBoard(this.scene, 1, 1, 4, this.size_casa, this.first_player, true);
	this.first_pieces[2] = new PieceBoard(this.scene, 1, 1, 5, this.size_casa, this.first_player, true);
	this.first_pieces[3] = new PieceBoard(this.scene, 1, 2, 4, this.size_casa, this.first_player, true);

	this.first_pieces[4] = new PieceBoard(this.scene, 2, 1, 2, this.size_casa, this.first_player, true);
	this.first_pieces[5] = new PieceBoard(this.scene, 2, 1, 6, this.size_casa, this.first_player, true);

	this.first_pieces[6] = new PieceBoard(this.scene, 3, 0, 0, this.size_casa, this.first_player, true);
	this.first_pieces[7] = new PieceBoard(this.scene, 3, 0, 8, this.size_casa, this.first_player, true);

	this.second_pieces[0] = new PieceBoard(this.scene, 1, 7, 3, this.size_casa, this.second_player, false);
	this.second_pieces[1] = new PieceBoard(this.scene, 1, 7, 4, this.size_casa, this.second_player, false);
	this.second_pieces[2] = new PieceBoard(this.scene, 1, 7, 5, this.size_casa, this.second_player, false);
	this.second_pieces[3] = new PieceBoard(this.scene, 1, 6, 4, this.size_casa, this.second_player, false);

	this.second_pieces[4] = new PieceBoard(this.scene, 2, 7, 2, this.size_casa, this.second_player, false);
	this.second_pieces[5] = new PieceBoard(this.scene, 2, 7, 6, this.size_casa, this.second_player, false);

	this.second_pieces[6] = new PieceBoard(this.scene, 3, 8, 0, this.size_casa, this.second_player, false);
	this.second_pieces[7] = new PieceBoard(this.scene, 3, 8, 8, this.size_casa, this.second_player, false);

}

MyBoard.prototype.boardToString = function () {
	board_string = '[';

	for(var i = 0; i < this.board_array.length;i++){
		board_string += '[';

		for(var j = 0; j < this.board_array.length; j++){
			board_string += "'";
			board_string += this.board_array[i][j];
			board_string += "'";
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

	var board_array = this.createArray(9,9);
	for(var i = 0; i < 9; i++){
		for(var j = 0; j < 9; j++){
			board_array[i][j] = 'empty';
		}
	}

	for(var i = 0; i < this.first_pieces.length; i++){
		var n_floors = this.first_pieces[i].getNFloors();
		var column = this.first_pieces[i].getColumn();
		var line = this.first_pieces[i].getLine();

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
		var column = this.second_pieces[i].getColumn();
		var line = this.second_pieces[i].getLine();

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

MyBoard.prototype.createArray = function(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = this.createArray.apply(this, args);
    }

    return arr;
}



MyBoard.prototype.displayPieces = function () {

	for(i = 0; i < this.first_pieces.length; i++){
		this.scene.pushMatrix();

		var line = this.first_pieces[i].getLine();
		var column = this.first_pieces[i].getColumn();

		this.scene.translate((column+1)*this.size_casa, line*this.size_casa, -0.01);
		this.scene.registerForPick(100+i, this.first_pieces[i]);
		this.first_pieces[i].display();

		this.scene.popMatrix();
	}

	for(i = 0; i < this.second_pieces.length; i++){
		this.scene.pushMatrix();

		var line = this.second_pieces[i].getLine();
		var column = this.second_pieces[i].getColumn();

		this.scene.translate((column+1)*this.size_casa, line*this.size_casa, -0.01);
		this.scene.registerForPick(200+i, this.second_pieces[i]);
		this.second_pieces[i].display();

		this.scene.popMatrix();
	}

	this.board_array = this.boardToArray();
 	this.board_string = this.boardToString();

}

MyBoard.prototype.display = function () {
	var degToRad = Math.PI / 180.0;

	this.displayPieces();

    for(var i = 0; i < 9; i++){
        this.scene.translate(this.size_casa,0, 0);
        for(var j = 0; j < 9; j++){
            this.scene.pushMatrix();
			this.texture.bind(0);
            this.scene.translate(0, j*this.size_casa,-0.01);
            this.scene.registerForPick(10*i+j, this.picking_objects[i][j]);

            this.picking_objects[i][j].display();
            this.scene.popMatrix();
        }
    }
 };
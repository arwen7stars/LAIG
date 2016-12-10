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

 };

MyBoard.prototype = Object.create(CGFobject.prototype);
MyBoard.prototype.constructor = MyBoard;

MyBoard.prototype.setInitialBoard = function () {
	// white = [1,1,1,1, 2,2, 3, 3]
	// linhas - 0 a 8
	// colunas - 1 a 9

	this.first_pieces[0] = new PieceBoard(this.scene, 1, 1, 4, this.first_player);
	this.first_pieces[1] = new PieceBoard(this.scene, 1, 1, 5, this.first_player);
	this.first_pieces[2] = new PieceBoard(this.scene, 1, 1, 6, this.first_player);
	this.first_pieces[3] = new PieceBoard(this.scene, 1, 2, 5, this.first_player);

	this.first_pieces[4] = new PieceBoard(this.scene, 2, 1, 3, this.first_player);
	this.first_pieces[5] = new PieceBoard(this.scene, 2, 1, 7, this.first_player);

	this.first_pieces[6] = new PieceBoard(this.scene, 3, 0, 1, this.first_player);
	this.first_pieces[7] = new PieceBoard(this.scene, 3, 0, 9, this.first_player);

	this.second_pieces[0] = new PieceBoard(this.scene, 1, 7, 4, this.second_player);
	this.second_pieces[1] = new PieceBoard(this.scene, 1, 7, 5, this.second_player);
	this.second_pieces[2] = new PieceBoard(this.scene, 1, 7, 6, this.second_player);
	this.second_pieces[3] = new PieceBoard(this.scene, 1, 6, 5, this.second_player);

	this.second_pieces[4] = new PieceBoard(this.scene, 2, 7, 3, this.second_player);
	this.second_pieces[5] = new PieceBoard(this.scene, 2, 7, 7, this.second_player);

	this.second_pieces[6] = new PieceBoard(this.scene, 3, 8, 1, this.second_player);
	this.second_pieces[7] = new PieceBoard(this.scene, 3, 8, 9, this.second_player);

}

MyBoard.prototype.displayPieces = function () {

	for(i = 0; i < this.first_pieces.length; i++){
		this.scene.pushMatrix();

		var line = this.first_pieces[i].getLine();
		var column = this.first_pieces[i].getColumn();

		this.scene.translate(line*this.size_casa, column*this.size_casa, 0);
		this.first_pieces[i].display();

		this.scene.popMatrix();
	}

	for(i = 0; i < this.second_pieces.length; i++){
		this.scene.pushMatrix();

		var line = this.second_pieces[i].getLine();
		var column = this.second_pieces[i].getColumn();

		this.scene.translate(line*this.size_casa, column*this.size_casa, 0);
		this.second_pieces[i].display();

		this.scene.popMatrix();
	}

}

MyBoard.prototype.display = function () {
	var degToRad = Math.PI / 180.0;

	this.first_pieces[0].movePiece(3,3);
	this.displayPieces();

    for(var i = 0; i < 9; i++){
        this.scene.translate(this.size_casa,0, 0);
        for(var j = 0; j < 9; j++){
            this.scene.pushMatrix();
			this.texture.bind(0);
            this.scene.translate(0, j*this.size_casa,0);
            this.scene.scale(0.96,0.96,0.96);
            this.scene.registerForPick(10*(i+1)+j, this.picking_objects[i][j]);

            this.picking_objects[i][j].display();
            this.scene.popMatrix();
        }
    }

    
 };
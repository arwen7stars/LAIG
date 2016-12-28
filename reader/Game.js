var valid_push = false;
var pushed_pieces;

function Game(scene, board) {
    this.scene = scene;
    this.board = board;
    this.gameOver = false;

    this.sel_line = -1;
	this.sel_column = -1;

	this.sel_first = -1;
	this.sel_second = -1;
	this.sel_piece;

	this.actualColumn = -1;
	this.actualLine = -1;

	this.board_first = this.board.getFirstPlayer();
	this.board_second = this.board.getSecondPlayer();

	this.currTurn = this.board_first;
	this.turnOngoing = false;
	this.moveInProgress = false;

	//this.valid_move = false;

	//this.playGame();
	
}

Game.prototype = Object.create(CGFobject.prototype);
Game.prototype.constructor = Game;

Game.prototype.makeRequest = function (){
	// Get Parameter Values
	//var requestString = document.querySelector("#query_field").value;

	// Make Request
	getPrologRequest("returnFakeX", handleReply);
	//getPrologRequest("startGame", handleReply);
	getPrologRequest("over(['3-red'])", handleReply);

}


/*Game.prototype.playGame = function () {
	var boardString = this.board.getBoard();
	var requestString = `isTheGameOver(` + boardString + `)`;
	this.getPrologRequest(requestString, function(data) {
			if (data.target.response != "no"){
				this.gameOver = true;
			}
	});
	this.turnOngoing = true;
	while(this.turnOngoing){
		console.log("PLAYER 1 TURN");
		
	}

	if(this.currTurn == this.board_first)
		this.currTurn = this.board_second;
	else this.currTurn = this.board_first;

	this.turnOngoing = true;
	while(this.turnOngoing){
		console.log("PLAYER 2 TURN");

	}

	if(this.currTurn == this.board_second)
		this.currTurn = this.board_first;
	else this.currTurn = this.board_second;
            
}*/


Game.prototype.getPrologRequest = function (requestString, onSuccess, onError, port){
	console.log("REQUEST STRING " + requestString);
	var requestPort = port || 8081
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

	request.onload = onSuccess || function(data){ console.log("Request successful. Reply: " + data.target.response); };
	request.onerror = onError || function(){ console.log("Error waiting for response"); };
	
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
}

/*Game.prototype.handleReply = function (data) {
	var if_true = "true";

	if(!if_true.localeCompare(data.target.response)){
		valid_move = 0;
	}
}*/

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

Game.prototype.checkMove = function (sel_line, sel_column, piece) {
	var line = piece.getLine();
	var column = piece.getColumn();
	var size = piece.getNFloors();

	var vert = sel_line - line;
	var hor = sel_column - column;

	var vert_abs = Math.abs(vert);
	var hor_abs = Math.abs(hor);

	if(vert_abs != 0 && hor_abs != 0)
		return false;
	
	var spaces;
	if(vert_abs != 0)
		spaces = vert_abs;
	else spaces = hor_abs;

	console.log("SPACES " + spaces + " SIZE " + size);

	if(spaces <= size)
		return true;
	else return false;
}

Game.prototype.selectPiece = function(obj, customId){
	var isFirstPiece = obj.isFirstPiece();

	if (isFirstPiece && (this.currTurn == this.board_first) && !this.turnOngoing){     // first pieces
		this.sel_first = customId % 100;
		this.sel_piece = obj;

		this.currTurn = this.board_second;
		this.turnOngoing = true;

		this.board.updatePieceSelected(true);

		console.log("FIRST " + this.sel_first + " NEXT TURN " + this.currTurn);

	} else if(!isFirstPiece && (this.currTurn == this.board_second) && !this.turnOngoing) {  // second pieces
		this.sel_second = customId % 200;
		this.sel_piece = obj;

		this.currTurn = this.board_first;
		this.turnOngoing = true;

		this.board.updatePieceSelected(true);

		console.log("SECOND " + this.sel_second + " NEXT TURN " + this.currTurn);
	}
}

Game.prototype.getPiece = function(isFirstPiece, col, lin){

	if(isFirstPiece){
		var pieces = this.board.getFirstPieces();
	} else{
		var pieces = this.board.getSecondPieces();
	}


	for(var i = 0; i < pieces.length; i++){
		var lin_piece = pieces[i].getLine();
		var col_piece = pieces[i].getColumn();

		if((lin_piece == lin) && (col_piece == col)){
			return pieces[i];
		}
	}
}

Game.prototype.getPieceIndex = function(isFirstPiece, col, lin){

	if(isFirstPiece){
		var pieces = this.board.getFirstPieces();
	} else{
		var pieces = this.board.getSecondPieces();
	}


	for(var i = 0; i < pieces.length; i++){
		var lin_piece = pieces[i].getLine();
		var col_piece = pieces[i].getColumn();

		if((lin_piece == lin) && (col_piece == col)){
			return i;
		}
	}
}

Game.prototype.checkPush = function(sel_line, sel_column, piece){
	var line = piece.getLine();
	var column = piece.getColumn();
	var size = piece.getNFloors();

	var vert = sel_line - line;
	var hor = sel_column - column;

	var vert_abs = Math.abs(vert);
	var hor_abs = Math.abs(hor);

	if(vert_abs != 0 && hor_abs != 0)
		return false;

	var dir;
	if(vert > 0)
		dir = "east";
	else if (vert < 0)
		dir = "west";
	else if (hor > 0)
		dir = "south";
	else if (hor < 0)
		dir = "north";
	
	var spaces;
	if(vert_abs != 0)
		spaces = vert_abs;
	else spaces = hor_abs;

	player = piece.getType();

	var boardString = this.board.getBoard();
	var requestString = `checkPush(` + boardString + `,` + column + `,` + line + `,` + dir + `,` + spaces + `,` + player + `)`;
	this.getPrologRequest(requestString, function(data){

		if(data.target.response == "true"){
			console.log("CHANGING STUFF...");
			valid_push = true;
	} else valid_push = false;
	});

}

Game.prototype.outOfBounds = function(column, line){
	if(column > 9 || line > 9 || column < 1 || line < 1)
		return true;
	else return false;

}

Game.prototype.getDirection = function(hor, vert){
	var dir;
	if(vert > 0)		// linha selecionada maior que linha atual
		dir = "east";
	else if (vert < 0)
		dir = "west";
	else if (hor > 0)	// coluna selecionada maior que coluna atual
		dir = "south";
	else if (hor < 0)
		dir = "north";
	
	return dir;
}

Game.prototype.movePushedPiece = function(pushed_piece, hor, vert){
		var new_line;
		var new_column;
		if(vert > 0){
			new_line = pushed_piece.getLine()+1;
			new_column = pushed_piece.getColumn();
		}else if (vert < 0){
			new_line = pushed_piece.getLine()-1;
			new_column = pushed_piece.getColumn();
		}else if (hor > 0){
			new_line = pushed_piece.getLine();
			new_column = pushed_piece.getColumn()+1;
		} else if (hor < 0){
			new_line = pushed_piece.getLine();
			new_column = pushed_piece.getColumn()-1;
		}

		if(!this.outOfBounds(new_column, new_line))
			pushed_piece.movePiece(new_column, new_line);
		else{
			var tmp_col = pushed_piece.getColumn();
			var tmp_lin = pushed_piece.getLine();
			var ind = this.getPieceIndex(pushed_piece.isFirstPiece(), tmp_col, tmp_lin);

			if(pushed_piece.isFirstPiece()){
				this.board.getFirstPieces().splice(ind, 1);
			} else{
				this.board.getSecondPieces().splice(ind, 1);
			}

		}
}

Game.prototype.playHumanTurn = async function(customId){
		this.sel_column = Math.floor(customId/10);
		this.sel_line = customId % 10;

	if( (this.sel_first > -1 || this.sel_second > -1) && this.turnOngoing && !this.moveInProgress){
		this.moveInProgress = true;
		var valid_move = this.checkMove(this.sel_line, this.sel_column, this.sel_piece);
		this.checkPush(this.sel_line, this.sel_column, this.sel_piece);
		await sleep(1000);


		if(valid_move && valid_push){
console.log("MOVE IN PROGRESS - START");
			var push = false;

			var curr_line = this.sel_piece.getLine();
			var curr_col = this.sel_piece.getColumn();

			var size = this.sel_piece.getNFloors();
			var vert = this.sel_line - curr_line;
			var hor = this.sel_column - curr_col;

			var dir = this.getDirection(hor, vert);

			var vert_abs = Math.abs(vert);
			var hor_abs = Math.abs(hor);

			var spaces;
			if(vert_abs != 0)
				spaces = vert_abs;
			else spaces = hor_abs;

			var boardString = this.board.getBoard();
			var pushed_pieces = "";

			var requestString = `getPushedPieces(` + boardString + `,` + curr_col + `,` + curr_line + `,` + dir + `)`;
			this.getPrologRequest(requestString, function(data) {
				pushed_pieces = data.target.response;
				console.log(data.target.response);	
			});
			await sleep(1000);

			console.log("PIECES " + pushed_pieces);
			var tmp_str = pushed_pieces.substr(1, pushed_pieces.indexOf('|')-1);

			if(spaces > 1){

				if(tmp_str.length != 0){
					push = true;
					var res = tmp_str.split(",");
					for(var j = 0; j < res.length; j++){
						var coord = res[j].split("-");
						console.log("COLUNA " + coord[0] + " LINHA " + coord[1]);

						var pushed_piece = this.getPiece(this.sel_piece.isFirstPiece(), coord[0], coord[1]);
						this.movePushedPiece(pushed_piece, hor, vert);

					}
				}

				if(vert > 0){
					curr_line = curr_line+1;
					curr_col = curr_col;
				}else if (vert < 0){
					curr_line = curr_line-1;
					curr_col = curr_col;
				}else if (hor > 0){
					curr_line = curr_line;
					curr_col = curr_col+1;
				} else if (hor < 0){
					curr_line = curr_line;
					curr_col = curr_col-1;
				}

				this.sel_piece.movePiece(curr_col,curr_line);
				
				for(var i=1; i < spaces; i++){
					var boardString = this.board.getBoard();

					var requestString = `getPushedPieces(` + boardString + `,` + curr_col + `,` + curr_line + `,` + dir + `)`;
					this.getPrologRequest(requestString, function(data) {
						pushed_pieces = data.target.response;
						console.log(data.target.response);	
					});
					await sleep(1000);
					
					var tmp_str = pushed_pieces.substr(1, pushed_pieces.indexOf('|')-1);
					var res = tmp_str.split(",");

					
					if(tmp_str.length != 0){
						for(var j = 0; j < res.length; j++){
							var coord = res[j].split("-");
							console.log("COLUNA " + coord[0] + " LINHA " + coord[1]);

							var pushed_piece = this.getPiece(this.sel_piece.isFirstPiece(), coord[0], coord[1]);
							this.movePushedPiece(pushed_piece, hor, vert);
						}
					}

					if(vert > 0){
						new_line = curr_line+1;
						new_column = curr_col;
					}else if (vert < 0){
						new_line = curr_line-1;
						new_column = curr_col;
					}else if (hor > 0){
						new_line = curr_line;
						new_column = curr_col+1;
					} else if (hor < 0){
						new_line = curr_line;
						new_column = curr_col-1;
					}

					this.sel_piece.movePiece(new_column,new_line);
				}

			}

			if(!push)
				this.sel_piece.movePiece(this.sel_column,this.sel_line);

			this.sel_line = -1;
			this.sel_column = -1;
			this.turnOngoing = false;
			this.board.updatePieceSelected(false);
			//valid_move = false;
			this.sel_first = -1;
			this.sel_second = -1;
		console.log("MOVE IN PROGRESS - END");
		} else{
			this.sel_line = -1;
			this.sel_column = -1;
		}
		this.moveInProgress = false;
	}	
	
}


Game.prototype.picking = function (obj, customId){
		if (obj)
		{			
			console.log("Picked object: " + obj + ", with pick id " + customId);

			// se o ID do picking for menor que 100, entao o id vai representar a casa selecionada (coluna-linha)
			if(customId < 100){
				this.playHumanTurn(customId);
			} else{
			// se o ID do picking for maior que 100, entao o id vai representar uma peca
				this.selectPiece(obj, customId);
			}
		}
}

Game.prototype.display = function () {
	this.scene.logPicking();
	this.scene.clearPickRegistration();
}


Game.prototype.update = function () {}
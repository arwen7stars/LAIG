var valid_push = false;
var pushed_pieces;
var score;
var auto_move;

function Game(scene, board, gameMode, difficulty) {
    this.scene = scene;
    this.board = board;

    this.gameMode = gameMode;
    this.difficulty = difficulty;

    var mode;
    switch (gameMode) {
        case 0: mode = 'Player VS Player'; break;
        case 1: mode = 'Player VS AI'; break;
        case 2: mode = 'AI VS AI'; break;
    }


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
	this.moveInProgress = false;

	if(this.gameMode == 0){
		this.humanTurn = true;
		this.computerTurn = false;
	} else if(this.gameMode == 2){
		this.computerTurn = true;
		this.humanTurn = false;

		this.autoPlay();
	}	
}

Game.prototype = Object.create(CGFobject.prototype);
Game.prototype.constructor = Game;

Game.prototype.autoPlay = async function (){
	do {
	
	if(!this.turnOngoing){
		this.turnOngoing = true;
		console.log("CURRENT TURN" + this.currTurn);
		var boardString = this.board.getBoard();

		var requestString = `thinkMove(` + boardString + `,` + this.currTurn + `,` + this.difficulty + `)`;
		this.getPrologRequest(requestString, function(data) {
			auto_move = data.target.response;
			console.log(data.target.response);	
		});
		await sleep(2000);

		console.log("RESPONSE " + auto_move);

		var move_info = auto_move.split("-");

		var column = Number(move_info[0]);
		var line = Number(move_info[1]);
		var dir = move_info[2];
		var spaces = Number(move_info[3]);

		var piece = this.board.getPiece(column, line);

		console.log("PIECE LINE " + piece.getLine() + " PIECE COL " + piece.getColumn());
		console.log("LINE " + line + " COLUMN " + column + " DIR " + dir + " SPACES " + spaces);

		var dest_line;
		var dest_col;
		if(dir == "east"){
			dest_line = line + spaces;
			dest_col = column;
		} else if(dir == "west"){
			dest_line = line - spaces;
			dest_col = column;
		} else if(dir == "south"){
			dest_line = line;
			dest_col = column + spaces;
		} else if(dir == "north"){
			dest_line = line;
			dest_col = column - spaces;
		}

		console.log("DEST LINE " + dest_line + " DEST COLUMN " + dest_col);

		this.movePiece(piece, dest_line, dest_col);
		await sleep(3000);

	// passa para o proximo turno
	if(this.currTurn == this.board_first)
		this.currTurn = this.board_second;
	else if(this.currTurn == this.board_second)
		this.currTurn = this.board_first;

		this.turnOngoing = false;
	}

	} while (!this.gameOver)


}

Game.prototype.getFirstPlayer = function(){
	return this.board_first;
}

Game.prototype.getSecondPlayer = function() {
	return this.board_second;
}

Game.prototype.setBoardScore = function(score_board){
	this.score_board = score_board;
	this.score_board.setPlayers(this.board_first, this.board_second);
	this.score_board.setActivePlayer(this.currTurn);
}


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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

Game.prototype.selectPiece = function(obj, customId){
	var isFirstPiece = obj.isFirstPiece();
	// verifica se o objeto selecionado e do primeiro jogador

	if (isFirstPiece && (this.currTurn == this.board_first)){     // first pieces
		this.sel_first = customId % 100;
		this.sel_piece = obj;

		this.board.updatePieceSelected(true);	// se uma peca estiver selecionada entao muda o id do picking
		// agora ao fazer picking das pecas torna-se possivel a selecao das casas em que estas se encontram

		console.log("FIRST PIECE SELECTED " + this.sel_first);

	} else if(!isFirstPiece && (this.currTurn == this.board_second)) {  // second pieces
		this.sel_second = customId % 200;
		this.sel_piece = obj;

		this.board.updatePieceSelected(true);

		console.log("SECOND PIECE SELECTED " + this.sel_second);
	}
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

	var dir = this.getDirection(hor, vert);
	
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
	// esta funcao obtem a direcao para mandar para o servidor
	// note-se que a disposicao do tabuleiro e diferente da dos ficheiros de prolog
	// (coluna e linha estao trocadas)
	var dir;
	if(vert > 0)		// linha selecionada maior que linha atual
		dir = "east";
	else if (vert < 0)	// linha selecionada menor que linha atual
		dir = "west";
	else if (hor > 0)	// coluna selecionada maior que coluna atual
		dir = "south";
	else if (hor < 0)	// coluna selecionada menor que coluna atual
		dir = "north";
	else dir = "undefined";
	
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
		
		// se a peca for empurrada para fora do tabuleiro, esta e removida do vetor de pecas
		if(!this.outOfBounds(new_column, new_line))
			pushed_piece.movePiece(new_column, new_line);
		else{
			var tmp_col = pushed_piece.getColumn();
			var tmp_lin = pushed_piece.getLine();
			var ind = this.board.getPieceIndex(tmp_col, tmp_lin);

			if(pushed_piece.isFirstPiece()){
				this.board.getFirstPieces().splice(ind, 1);
			} else{
				this.board.getSecondPieces().splice(ind, 1);
			}

		}
}

Game.prototype.getPushedPieces = function(boardString, curr_col, curr_line, dir){
	var requestString = `getPushedPieces(` + boardString + `,` + curr_col + `,` + curr_line + `,` + dir + `)`;
	this.getPrologRequest(requestString, function(data) {
		pushed_pieces = data.target.response;
		console.log(data.target.response);	
	});	
}

Game.prototype.getScore = function(board) {
	var boardString = board.getBoard();
	var requestString = `getBoardScore(` + boardString + `)`;
	this.getPrologRequest(requestString, function(data) {
		score = data.target.response;
	});

}

Game.prototype.movePiece = async function (piece, line, column){
	var push = false;

	var curr_line = piece.getLine();		// linha atual da peca que se pretende mover
	var curr_col = piece.getColumn();		// coluna atual da peca que se pretende mover

	var size = piece.getNFloors();			// numero de andares da peca que se pretende mover
	var vert = line - curr_line;			// offset na vertical
	var hor = column - curr_col;			// offset na horizontal

	var dir = this.getDirection(hor, vert);	// vai obter a direcao para mandar para o servidor

	var vert_abs = Math.abs(vert);
	var hor_abs = Math.abs(hor);

	var spaces;								// numero de espacos que a peca vai mover
	if(vert_abs != 0)
		spaces = vert_abs;
	else spaces = hor_abs;

	var boardString = this.board.getBoard();	// string corresponde ao tabuleiro
	pushed_pieces = "";

	this.getPushedPieces(boardString, curr_col, curr_line, dir);
	// pushed_pieces vai conter um array das pecas movidas
	await sleep(1000);

	var tmp_str = pushed_pieces.substr(1, pushed_pieces.indexOf('|')-1);

	if(tmp_str.length != 0 || spaces > 1){
		// se o array nao estiver vazio uma ou mais pecas vao ser empurradas
		push = true;
		if(tmp_str.length != 0){
			var res = tmp_str.split(",");
			for(var j = 0; j < res.length; j++){
				var coord = res[j].split("-");	// coordenadas da peca empurrada
				console.log("COLUNA " + coord[0] + " LINHA " + coord[1]);

				var pushed_piece = this.board.getPiece(coord[0], coord[1]);
				this.movePushedPiece(pushed_piece, hor, vert);

			}
		}
		
		// a peca a empurrar vai mover uma casa de cada vez
		if(vert > 0){
			curr_line = curr_line+1;
		}else if (vert < 0){
			curr_line = curr_line-1;
		}else if (hor > 0){
			curr_col = curr_col+1;
		} else if (hor < 0){
			curr_col = curr_col-1;
		}

		piece.movePiece(curr_col,curr_line);

		if(spaces > 1){
			// se o numero de espacos a mover for maior que um repete-se o mesmo processo
			for(var i=1; i < spaces; i++){
				var boardString = this.board.getBoard();

				this.getPushedPieces(boardString, curr_col, curr_line, dir);
				await sleep(1000);

				var tmp_str = pushed_pieces.substr(1, pushed_pieces.indexOf('|')-1);
				var res = tmp_str.split(",");

				if(tmp_str.length != 0){
					for(var j = 0; j < res.length; j++){
						var coord = res[j].split("-");
						console.log("COLUNA " + coord[0] + " LINHA " + coord[1]);

						var pushed_piece = this.board.getPiece(coord[0], coord[1]);
						this.movePushedPiece(pushed_piece, hor, vert);
					}
				}

				if(vert > 0){
					curr_line = curr_line+1;
				}else if (vert < 0){
					curr_line = curr_line-1;
				}else if (hor > 0){
					curr_col = curr_col+1;
				} else if (hor < 0){
					curr_col = curr_col-1;
				}

				piece.movePiece(curr_col,curr_line);
			}
		}

	}

	if(!push)
		piece.movePiece(column,line);
	
	score = "";

	this.getScore(this.board);
	await sleep(1000);

	console.log("SCORE " + score);
	var scores = score.split("-");
	console.log("FIRST " + scores[0] + " SECOND " + scores[1]);

	if(scores[0] >= 7 || scores[1] >= 7){
		this.gameOver = true;
	}

	// atualiza a placa de scores
	this.score_board.update(scores[0], scores[1]);

}

Game.prototype.playHumanTurn = async function(customId){
		this.sel_column = Math.floor(customId/10);
		this.sel_line = customId % 10;

	if( (this.sel_first > -1 || this.sel_second > -1) && !this.moveInProgress){
		this.moveInProgress = true;
		var sel_line = this.sel_line;
		var sel_column = this.sel_column;
		var sel_piece = this.sel_piece;
		
		this.sel_line = -1;
		this.sel_column = -1;

		var valid_move = this.checkMove(sel_line, sel_column, sel_piece);

		this.checkPush(sel_line, sel_column, sel_piece);
		await sleep(1000);

		if(valid_move && valid_push){
			this.movePiece(sel_piece, sel_line, sel_column);

			if(this.currTurn == this.board_first)
				this.currTurn = this.board_second;
			else if(this.currTurn == this.board_second)
				this.currTurn = this.board_first;
			
			this.board.updatePieceSelected(false);
			this.sel_first = -1;
			this.sel_second = -1;
		}
		
		this.moveInProgress = false;
	}	
	
}


Game.prototype.picking = function (obj, customId){
		if (obj && this.humanTurn)
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


Game.prototype.update = function () {
	this.score_board.setActivePlayer(this.currTurn);	
}
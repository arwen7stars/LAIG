var valid_move = false;

function Game(scene, board) {
    this.scene = scene;
    this.board = board;
    this.gameOver = false;

    this.sel_line = -1;
	this.sel_column = -1;

	this.sel_first = -1;
	this.sel_second = -1;

	this.actualColumn = -1;
	this.actualLine = -1;

	this.board_first = this.board.getFirstPlayer();
	this.board_second = this.board.getSecondPlayer();

	this.currTurn = this.board_first;
	this.turnOngoing = false;

	this.valid_move = false;

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

Game.prototype.checkMove = async function (sel_line, sel_column, piece) {
	var line = piece.getLine();
	var column = piece.getColumn();
	var size = piece.getNFloors();

	var vert = sel_line - line;
	var hor = sel_column - column;

	var dir;
	if(vert > 0)
		dir = "east";
	else if (vert < 0)
		dir = "west";
	else if (hor > 0)
		dir = "south";
	else if (hor < 0)
		dir = "north";

	var vert_abs = Math.abs(vert);
	var hor_abs = Math.abs(hor);

	if(vert_abs != 0 && hor_abs != 0)
		return false;
	
	var spaces;
	if(vert_abs != 0)
		spaces = vert_abs;
	else spaces = hor_abs;
	
	var requestString = `checkMove(` + line + `,` + column + `,` + dir + `,` + spaces + `,` + size + `)`;
	this.getPrologRequest(requestString, function(data){

		if(data.target.response == "true"){
			valid_move = true;
			console.log("CHANGING STUFF...");
	} else valid_move = false;
	});
}

Game.prototype.selectPiece = function(obj, customId){
	var isFirstPiece = obj.isFirstPiece();

	if (isFirstPiece && this.currTurn == this.board_first && !this.turnOngoing){     // first pieces
		this.sel_first = customId % 100;

		this.currTurn = this.board_second;
		this.turnOngoing = true;

		console.log("FIRST " + this.sel_first + " NEXT TURN " + this.currTurn);

	} else if(!isFirstPiece && this.currTurn == this.board_second && !this.turnOngoing) {  // second pieces
		this.sel_second = customId % 200;

		this.currTurn = this.board_first;
		this.turnOngoing = true;

		console.log("SECOND " + this.sel_second + " NEXT TURN " + this.currTurn);
	}
}

Game.prototype.playHumanTurn = async function(customId){
	if((this.sel_first > 0 || this.sel_second > 0) && this.turnOngoing){
		this.sel_column = Math.floor(customId/10);
		this.sel_line = customId % 10;

		console.log("LINHA " + this.sel_line);
		console.log("COLUNA " + this.sel_column);

		var piece;

		if(this.sel_first > 0)
			piece = this.board.getFirstPieces()[this.sel_first];
		else piece = this.board.getSecondPieces()[this.sel_second];

		console.log("SERVER RESPONSE BEFORE " + valid_move);
		this.checkMove(this.sel_line, this.sel_column, piece);
		await sleep(500);
		console.log("SERVER RESPONSE AFTER CHECKMOVE " + valid_move);

		if(valid_move){
			
			piece.movePiece(this.sel_column,this.sel_line);
			this.sel_line = -1;
			this.sel_column = -1;
			this.turnOngoing = false;
			valid_move = false;
			this.sel_first = -1;
			this.sel_second = -1;
		} else{
			this.sel_line = -1;
			this.sel_column = -1;
		}
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
				this.selectPiece(obj, customId);
			}
		}
}


Game.prototype.update = function () {

	/*if(this.sel_column >= 0 || this.sel_line >= 0){
		if(this.sel_first > 0){
			var piece = this.board.getFirstPieces()[this.sel_first];
				
			this.checkMove(this.sel_line, this.sel_column, piece);
			console.log("SERVER RESPONSE AFTER CHECKMOVE" + valid_move);
			if(valid_move){
				piece.movePiece(this.sel_column,this.sel_line);
				this.sel_first = -1;
				this.sel_line = -1;
				this.sel_column = -1;
				this.turnOngoing = false;
				valid_move = false;
			} else{
				this.sel_line = -1;
				this.sel_column = -1;
			}
		
		} else if (this.sel_second > 0){
			this.board.getSecondPieces()[this.sel_second].movePiece(this.sel_column,this.sel_line);
			this.sel_second = -1;
			this.sel_line = -1;
			this.sel_column = -1;
			this.turnOngoing = false;
		}
	}*/
	
}
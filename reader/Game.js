function Game(scene, board) {
    this.scene = scene;
    this.board = board;

    this.lin = -1;
	this.col = -1;

	this.first = -1;
	this.second = -1;

	this.actualColumn = -1;
	this.actualLine = -1;

	//this.startGame();
	
}

Game.prototype = Object.create(CGFobject.prototype);
Game.prototype.constructor = Game;

Game.prototype.startGame = function () {
	board = this.board.getBoard();
	var pos = "1-1-south-1";
	var player = "red";
	var board = "[[empty, empty, empty, empty, 3-red, empty, empty, empty, empty],[empty, empty, empty, empty, empty, empty, empty, empty, empty],[empty, empty, empty, empty, 2-white, empty, empty, empty, empty],[empty, empty, empty, empty, empty, empty, 1-red, 1-white, empty],[empty, 2-red, empty, empty, empty, 1-red, 1-white, empty, empty],[empty, empty, empty, empty, empty, 1-red, empty, empty, empty],[empty, empty, empty, empty, empty, empty, empty, empty, empty],[empty, empty, empty, empty, empty, empty, empty, empty, empty],[3-white, empty, empty, empty, empty, empty, empty, empty, empty]]";
	var prologRequestUser = "func(" + board + ")";

	request = typeof request !== 'undefined' ? request : false;

	if (!request)
		console.log("Please make a valid request.");
    
    this.callRequest(prologRequestUser, this.handleReplyBoard);
            
}

Game.prototype.handleReplyBoard = function (data) {
    console.info("Response: " + data.target.response);
    this.serverResponse = data.target.response;
}

Game.prototype.callRequest = function (requestString, onSuccess, onError, port) {
    var requestPort = port || 8081;
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

    request.onload = onSuccess || function (data) { console.log("Request successful."); };
    request.onerror = onError || function () { console.log("Error waiting for response"); };

    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send();
}

Game.prototype.picking = function (obj, customId){
    if (obj)
    {			
        console.log("Picked object: " + obj + ", with pick id " + customId);

        if(customId < 100){

        	if(this.first > 0 || this.second > 0){

        		if(this.first > 0 && this.second < 0){
					this.col = Math.floor(customId/10);
					this.lin = customId % 10;

					console.log("LINHA " + this.lin);
					console.log("COLUNA " + this.col);
        		} else if(this.second > 0 && this.first < 0){
					this.col = Math.floor(customId/10);
					this.lin = customId % 10;

					console.log("LINHA " + this.lin);
					console.log("COLUNA " + this.col);
        		}
        	}
        } else if (customId < 200){     // first pieces
            this.first = customId % 100;
            console.log("FIRST " + this.first);
        } else {                        // second pieces
            this.second = customId % 200;
            console.log("SECOND " + this.second);
        }
    }
}

Game.prototype.update = function () {
	
}
:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

board([['3-red','empty','empty','empty','empty','empty','empty','empty','3-white'],['empty','empty','empty','empty','empty','empty','empty','empty','empty'],['empty','2-red','empty','empty','empty','empty','empty','2-white','empty'],['empty','1-red','empty','empty','empty','empty','empty','1-white','empty'],['empty','1-red','1-red','empty','empty','empty','1-white','1-white','empty'],['empty','1-red','empty','empty','empty','empty','empty','1-white','empty'],['empty','2-red','empty','empty','empty','empty','empty','2-white','empty'],['empty','empty','empty','empty','empty','empty','empty','empty','empty'],['3-red','empty','empty','empty','empty','empty','empty','empty','3-white']], server
).


% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input

handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here

:-include('logic.pl').
:-include('score.pl').

isGameOver(Board, Answer) :-
	gameOver(Board, draw),
	Answer = 'draw'.

isGameOver(Board, Answer) :-
	gameOver(Board, red),
	Answer = 'red'.

isGameOver(Board, Answer) :-
	gameOver(Board, white),
	Answer = 'white'.
	
isGameOver(_, Answer) :-
	Answer = 'no'.
	
checkMove(Row, Col, Dir, Spaces, Size, Answer) :-
	checkMovement(Row-Col, Dir, Spaces, Size),
	Answer = 'true'.

checkMove(_, _, _, _, _, Answer) :-
	Answer = 'false'.

pushedPieces(Board, Row, Col, Dir, Result) :-
	getPiece(Board, Row-Col, Size-Team),
	setPiece(Board, empty, Row-Col, TmpBoard),
	getNewPosition(Row-Col, Dir, 1, X-Y),
	pushedPieceAux(TmpBoard, Size-Team, X, Y, Dir, Size, Result, _).

%Piece goes out of bounds	
pushedPieceAux(InitialBoard, _, Row, Col, _, _, _, InitialBoard):-
	\+getPiece(InitialBoard, Row-Col, _PushedPiece),
	outOfBounds(Row-Col).

pushedPieceAux(InitialBoard, Piece, Row, Col, _, _, _, FinalBoard):-
	\+getPiece(InitialBoard, Row-Col, _PushedPiece),
	setPiece(InitialBoard, Piece, Row-Col, FinalBoard).

pushedPieceAux(Board, Piece, Row, Col, Dir, Size, [Pushed | Rest], FinalBoard) :-
	Size > 0,
	getPiece(Board, Row-Col, PushedPiece),
	Pushed = Row-Col,
	setPiece(Board, Piece, Row-Col, TmpBoard),
	getNewPosition(Row-Col, Dir, 1, X-Y),
	S is Size - 1,
	pushedPieceAux(TmpBoard, PushedPiece, X, Y, Dir, S, Rest, FinalBoard).
	
getPushedPieces(Board, Row, Col, Dir, Answer):-
	pushedPieces(Board, Row, Col, Dir, Result),
	Answer = Result.	
	
getPushedPieces(_, _, _, _, Answer):-
	Answer = 'no'.
	
checkPush(Board, Row, Col, Dir, Spaces, Player, Answer) :-
	movePiece(Board, Row-Col, Dir, Spaces, Player, _, _),
	Answer = 'true'.

checkPush(_, _, _, _, _, _, Answer) :-
	Answer = 'false'.


parse_input(startGame, 'game may have started'):- game.
parse_input(isTheGameOver(Board), Answer) :- isGameOver(Board, Answer).
parse_input(checkMove(Row, Col, Dir, Spaces, Size), Answer) :- checkMove(Row, Col, Dir, Spaces, Size, Answer).
parse_input(checkPush(Board, Row, Col, Dir, Spaces, Player), Answer) :- checkPush(Board, Row, Col, Dir, Spaces, Player, Answer).
parse_input(getPushedPieces(Board, Row, Col, Dir), Answer) :- getPushedPieces(Board, Row, Col, Dir, Answer).
parse_input(quit, goodbye).
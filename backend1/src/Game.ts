import { Chess } from "chess.js";
import type WebSocket from "ws";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages.js";

export class Game{
    // Game class implementation
    public player1: WebSocket;
    public player2: WebSocket;
    // private board: string;
    // public moves: string[];
    //instead of these we will use chess.js to manage the game state, it is a popular chess library
    public board: Chess;
    private startTime: Date;
    private moveCount: number = 0;

    constructor(player1: WebSocket, player2: WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        // this.board = "";
        // this.moves = [];
        this.board = new Chess();
        this.startTime = new Date();

        // Notify both players that the game has started
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white",
            }
        }));

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black",
            }
        }));
    }

    makeMove(socket: WebSocket, move: {
        from: string,
        to: string,
    }){
        // Logic to make a move
        
        //first you need to validate if it's the player's turn 
        if(this.moveCount % 2 === 0 && socket !== this.player1){
            //not player1's turn
            return;
        }
        if(this.moveCount % 2 === 1 && socket !== this.player2){
            //not player2's turn
            return;
        }
        //then is the move valid
        try {
            this.board.move(move); //this will throw an error if the move is invalid
            
        } catch (error) {
            console.log("Error: ", error);
            return;
        }




        //update the board state
        //record the move
        //this two are handled by chess.js so no need to do anything here
        

        //check if the game is over
        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white',
                }
            }));
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    winner: this.board.turn() === 'w' ? 'black' : 'white',
                }
            }));
            
            return;
        }

        //if the game is not over, notify the other player of the move
        if(this.moveCount % 2 === 0){
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move,
            }))
        }else{
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move,
            }))
        }

        this.moveCount += 1;


        //notify both players of the updated game state


    }
}
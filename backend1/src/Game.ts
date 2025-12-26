import type WebSocket from "ws";

export class Game{
    // Game class implementation
    public player1: WebSocket;
    public player2: WebSocket;
    private board: string;
    public moves: string[];
    private startTime: Date;

    constructor(player1: WebSocket, player2: WebSocket){
        this.player1 = player1;
        this.player2 = player2;
        this.board = "";
        this.moves = [];
        this.startTime = new Date();
    }

    makeMove(socket: WebSocket, move: string){
        // Logic to make a move
        
        //first you need to validate if it's the player's turn 
        //then is the move valid



        //update the board state
        //record the move
        

        //check if the game is over


        //notify both players of the updated game state


    }
}
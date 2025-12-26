import type { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages.js";
import { Game } from "./Game.js";


export class GameManager{
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];


    constructor(){
        this.games = [];
        this.users = [];
        this.pendingUser = null;
    }

    addUser(socket: WebSocket){
        this.users.push(socket);
        //when user is added, we need to add event handlers to the socket
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket){
        this.users = this.users.filter(user => user !== socket);
    }

    private addHandler(socket: WebSocket){
        //check the message type and handle accordingly
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString());

            
            if(message.type === INIT_GAME){
                //if the message type is to start a game, we have to check if there is a pending user
                if(this.pendingUser){
                    //start a new game with the pending user and the current user
                    const newGame = new Game(this.pendingUser, socket);
                    this.games.push(newGame);
                    this.pendingUser = null;
                }else{
                    //set the current user as the pending user
                    this.pendingUser = socket;
                }
            }

            //if user sends a move message, we need to find the game they are in and update the game state
            if(message.type === MOVE){
                const game = this.games.find(g => g.player1 === socket || g.player2 === socket);
                if(game){
                    game.makeMove(socket, message.move);
                }

            }
        });
    }
}
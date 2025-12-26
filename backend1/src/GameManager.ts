import type { WebSocket } from "ws";
import { INIT_GAME } from "./messages.js";
import type { Game } from "./Game.js";


export class GameManager{
    private games: Game[];
    private pendingUser: WebSocket | null = null;
    private users: WebSocket[];


    constructor(){
        this.games = [];
        this.users = [];
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
                    // const newGame = new Game(this.pendingUser, socket);
                    // this.games.push(newGame);
                    // this.pendingUser = null;
                }else{
                    //set the current user as the pending user
                    this.pendingUser = socket;
                }
            }
        });
    }
}
import { io } from "socket.io-client";
import { IOnlineUser } from "../components/types";

export class Websocket {

    static _instance: Websocket | null = null;
    private connectionInstance: any = null;

    public static getInstance() {
        if (Websocket._instance == null) {
            Websocket._instance = new Websocket();
        }
        return Websocket._instance;
    }


    handleConnect(userDetails : IOnlineUser) {
        console.log('user is connected now');
        this.connectionInstance.emit('join', { data: { ...userDetails } });
    }

    handleError(err: any) {
        console.log(err)
    }


    connect(userDetails: IOnlineUser) {
        if(this.connectionInstance === null){
            this.connectionInstance = io("ws://localhost:8000", {
                path: '/ws/socket.io/',
            });

            this.connectionInstance.on('connect', () => this.handleConnect(userDetails));
            this.connectionInstance.on('error', this.handleError)
        }
        return this.connectionInstance
    }

    disconnect() {
        if (this.connectionInstance) {
            this.connectionInstance.off('connect', this.handleConnect);
            this.connectionInstance.off('error', this.handleError)
            this.connectionInstance.disconnect();
            this.connectionInstance = null;
        }
    }

    emit(event: string, payload : any) {
        if (this.connectionInstance) {
            this.connectionInstance.emit(event, payload)
        }
    }

    on(event: string, handler: any) {
        if (this.connectionInstance) {
            this.connectionInstance.on(event, handler)
        }
    }

    off(event: string, handler: any) {
        if (this.connectionInstance) {
            this.connectionInstance.off(event, handler)
        }
    }


}
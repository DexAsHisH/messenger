import { Websocket } from "../services/websocket";

export const useWebSocket = () => {
    const ws = Websocket.getInstance()

   const on = (event : string, handler: any) => {
        if(ws){
            ws.on(event, handler)
        }
   }

   const off = (event : string, handler: any) => {
        if(ws){
            ws.off(event, handler)
        }
   }

   const emit = (event: string, payload : any) => {
       if(ws){
           ws.emit(event, payload);
       }
   }



   return {on, off, emit}
}

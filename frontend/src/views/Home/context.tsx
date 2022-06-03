import { noop } from "lodash";
import { createContext, Dispatch, FC, SetStateAction, useState } from "react";
import { IOnlineUser } from "../../components/types";

export const MessageContext = createContext<{activeChat : IOnlineUser | null,setActiveChat: Dispatch<SetStateAction<IOnlineUser | null>>, onlineUsers : IOnlineUser[] , setOnlineUsers : Dispatch<SetStateAction<IOnlineUser[]>> , messages : {[key: string]: {type: string, message: string}[]}, setMessages : Dispatch<SetStateAction<{[key: string]: {type: string, message: string}[]}>>}>({
    activeChat : null,
    setActiveChat : noop,
    onlineUsers : [],
    setOnlineUsers : noop,
    messages : {},
    setMessages : noop

});


export const MessageContextProvider: FC = ({children}) => {
    const [activeChat, setActiveChat] = useState<IOnlineUser | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<IOnlineUser[]>([]);
    const [messages, setMessages] = useState<{[key: string]: {type: string, message: string}[]}>({});

    return <MessageContext.Provider value={{activeChat ,setActiveChat ,onlineUsers,setOnlineUsers, messages, setMessages }}>
    {children } 
    </MessageContext.Provider>
}
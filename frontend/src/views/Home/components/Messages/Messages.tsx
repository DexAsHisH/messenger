import { useCallback, useContext, useEffect } from "react"
import { useSelector } from "react-redux"
import { IOnlineUser } from "../../../../components/types"
import { useWebSocket } from "../../../../hooks/useSocketConnection"
import { userDetailsSelector } from "../../../../store/userDetails/selector"
import { MessageContext } from "../../context"
import { ActiveContacts, Chat } from "./components"
import './Messages.scss'

export const Messages = () => {

    const { activeChat, setOnlineUsers, setActiveChat } = useContext(MessageContext)
    const socket = useWebSocket();
    const userDetails = useSelector(userDetailsSelector)

    const handleUserDisconnect = useCallback((data: IOnlineUser) => {
        console.log('user disconnected')
        setOnlineUsers((prev) => {
            return prev.filter((user) => user.userId !== data.userId)
        })

        if(data.userId === activeChat?.userId){
            setActiveChat(null)
        }
    }, [activeChat?.userId, setActiveChat, setOnlineUsers])


    const handleUserJoined = useCallback((data: IOnlineUser) => {
        console.log("UserJoined")
        if (data.userId !== userDetails.userId) {
            setOnlineUsers((prev) => {
                const elementFound = prev.findIndex((user) => user.userId === data.userId)

                if (elementFound === -1) {
                    return [...prev, data]
                }

                return prev
            })
        }
    }, [setOnlineUsers, userDetails])


    useEffect(() => {
        if (socket) {
            socket.on('user-disconnect', handleUserDisconnect)
            socket.on('user-joined', handleUserJoined)
        }

        return () => {
            if (socket) {
                console.log("DIsconnectiong")
                socket.off('user-disconnect', handleUserDisconnect)
                socket.off('user-joined', handleUserJoined)
            }
        }

    }, [activeChat, handleUserDisconnect, handleUserJoined, setOnlineUsers, socket, userDetails])

    return <div className="messages">
        <ActiveContacts />
        <Chat />
    </div>
}
import { faCommentDots,faPaperPlane, faTimesCircle } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { FC, useCallback, useContext, useEffect, useRef, useState } from "react"
import Avatar from "react-avatar"

import { useSelector } from "react-redux"

import { Button } from "@mui/material"
import { userDetailsSelector } from "../../../../../../store/userDetails/selector"
import { MessageContext } from "../../../../context"
import { useWebSocket } from "../../../../../../hooks/useSocketConnection"


interface INotification { from: string, to: string, message: string }


export const Chat: FC = () => {

    const { activeChat,setActiveChat, messages, setMessages } = useContext(MessageContext)
    const chatRef = useRef<any>(null);
    const userDetails = useSelector(userDetailsSelector)
    const [messageToSend, setMessageToSend] = useState('');

    const socket = useWebSocket()

    const handleSendClick = useCallback(() => {
        if (!activeChat || !socket || !messageToSend.length) return;



        socket.emit('send-message', {
            to: activeChat.userId,
            from: userDetails.userId,
            message: messageToSend
        })
        //setMessages((prev) => [...prev, {type : 'sent', message : messageToSend}])
        // setMessages((prev) => ({...prev, [activeUser.userId] : [ ...(prev[activeUser.userId] ? prev[activeUser.userId] : {}), {type : 'sent', message : messageToSend}]}))
        setMessages((prev) => {
            if (prev[activeChat.userId]) {
                return { ...prev, [activeChat.userId]: [...prev[activeChat.userId], { type: 'sent', message: messageToSend }] }
            } else {
                return { ...prev, [activeChat.userId]: [{ type: 'sent', message: messageToSend }] }
            }
        })
        setMessageToSend('')
    }, [activeChat, messageToSend, setMessages, socket, userDetails.userId])

    const handleMessageRecieve = useCallback((data: INotification) => {

        console.log("faaf")
        if (activeChat) {
            //setMessages((prev) => ({...prev, [data.to] : [...(prev[data.to] ? prev[data.to] : {}), {type : 'recieved', message : data.message}]}))
            // setMessages((prev: any) => {
            //     if (prev[data.from]) {
            //         return { ...prev, [data.from]: [...prev[data.from], { type: 'recieved', message: data.message }] }
            //     } else {
            //         return { ...prev, [data.from]: [{ type: 'recieved', message: data.message }] }
            //     }
            // })
            if (chatRef.current) {
                chatRef.current.scrollTop = chatRef.current.scrollHeight;
            }
        }
    }, [activeChat])

    useEffect(() => {

        if (socket) {

            socket.on('message-recieve', handleMessageRecieve)
        }

        return () => {
            if (socket) {
                socket.off('message-recieve', handleMessageRecieve)
            }
        }
    }, [handleMessageRecieve, socket])


    return activeChat && activeChat.userId ? <div className="main-container">
        <div className="chat-header">
            <div className="chat-header__icon" ><Avatar googleId={activeChat.userId} src={activeChat.image} size="60" round={true} /> </div>
            <div className="chat-header__desc" >
                <div className="chat-header__name">{activeChat.name}</div>
                <span className="chat-header__last-seen">Online</span>
            </div>
            <div className="chat-header__icon-close" onClick={() => setActiveChat(null)}><FontAwesomeIcon icon={faTimesCircle} /> </div>
        </div>

        <div className="chat-messages" ref={chatRef}>

            <div className="chat-messages__conversations">
                {messages[activeChat.userId]?.map((message) => {
                    if (message.type === 'recieved') {
                        return <div className="chat-messages__message_icon"><Avatar googleId={userDetails.userId} src={activeChat.image} size="20" round={true} /><div className="chat-messages__message-recieved">{message.message}</div></div>
                    } else {
                        return <div className="chat-messages__message-sent" >{message.message}</div>
                    }
                })}

            </div>

        </div>
        <footer className="chat-messages__send-message">

            <div className="chat-messages__input">
                <input type="text" placeholder="Send something..." value={messageToSend} onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        handleSendClick()
                    }
                }} onChange={({ target }) => setMessageToSend(target.value)} />
            </div>
            <div className="chat-messages__send">
                <Button variant='contained' color='primary' size='small' onClick={handleSendClick} ><FontAwesomeIcon icon={faPaperPlane} size="lg" /></Button>
            </div>
        </footer>
    </div> : <div className="welcome_banner">
        <FontAwesomeIcon icon={faCommentDots} size="4x" /><h1>Hello Chat</h1>
        <span>Select a user to start conversation.</span>
    </div>
}
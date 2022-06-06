import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Avatar from "react-avatar"
import cx from 'classnames'
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import { useSelector } from "react-redux"
import http from 'axios'
import './ActiveContacts.scss'
import { userDetailsSelector } from '../../../../../../store/userDetails/selector';
import { INotification, IOnlineUser } from '../../../../../../components/types';
import { MessageContext } from '../../../../context';
import { useWebSocket } from '../../../../../../hooks/useSocketConnection';


const getConnectedUsers = () => {
    return http.get('http://127.0.0.1:8000/getOnlineUsers')
}

export const ActiveContacts: FC = () => {

    const userDetails = useSelector(userDetailsSelector)
    const { activeChat, setActiveChat, onlineUsers, setOnlineUsers, setMessages } = useContext(MessageContext)
    const [hasNotification, setHasNotification] = useState<{ [key: string]: number }>({})
    const socket = useWebSocket();


    useEffect(() => {
        getConnectedUsers().then((res) => {
            const onlineUsersList = res.data.filter((user: IOnlineUser) => user.userId !== userDetails.userId)
            console.log(onlineUsersList)
            setOnlineUsers(onlineUsersList)
        }).catch((err) => {
            console.error(err)
        });

    }, [setOnlineUsers, userDetails])


    const handleSelectChat = (user: IOnlineUser) => {

        setActiveChat(user)
        setHasNotification((prev) => {
            if (prev && prev[user.userId]) {
                delete prev[user.userId]
                return prev
            }
            return prev
        })
        // if (setActiveUser) {
        //     setActiveUser(user)
        // }
    }

    const handleMessageRecieved = useCallback((data: INotification) => {

        console.log("faaf")
 
            console.log("FASFAF");
            console.log(data)
            console.log(activeChat)
        if (activeChat?.userId !== data.from) {
            console.log("Set Notification COunt")
            setHasNotification((prev : any) => ({ ...prev, [data.from]: prev[data.from] ? prev[data.from] + 1 : 1 }))
        }else{
        // //setMessages((prev) => ({...prev, [data.to] : [...(prev[data.to] ? prev[data.to] : {}), {type : 'recieved', message : data.message}]}))
        setMessages((prev) => {
            if (prev[data.from]) {
                return { ...prev, [data.from]: [...prev[data.from], { type: 'recieved', message: data.message }] }
            } else {
                return { ...prev, [data.from]: [{ type: 'recieved', message: data.message }] }
            }
        })
    }
        // if (chatRef.current) {
        //     chatRef.current.scrollTop = chatRef.current.scrollHeight;
        // }
    }, [activeChat, setMessages])

    useEffect(() => {

       if(socket){

        socket.on('message-recieve',handleMessageRecieved );

       }

       return () => {
           if(socket){
        socket.off('message-recieve',handleMessageRecieved );
           }
       }

    }, [handleMessageRecieved, socket])


    return (<div className="left-container">
        <div className="left-container__my-profile">
            <div className="left-container__profile-image">
                <Avatar googleId={userDetails.userId} src={userDetails.image} size="100" round={true} />
                {/* <img src={userDetails.image}/> */}
            </div>
            <div className="left-container__my-profile__profile-name">
            { userDetails.firstName || userDetails.lastName ? <h2>{userDetails.firstName} {userDetails.lastName}</h2> : <h2>{userDetails.name}</h2>}
            </div>
            {/* <div className="left-container__my-acc">my account</div> */}
        </div>
        <div className="left-container__search">
            <div className="left-container__search-search-icon"><FontAwesomeIcon icon={faSearch} size="lg" /></div>
            <input className="left-container__search-search-bar" type="text" placeholder="search here">
            </input>

        </div>
        <div className="left-container__chat-list">
            <div className="left-container__chat-list__header">Online Users</div>
            {onlineUsers.length ? onlineUsers.map((onlineUser) =>
                <div id={onlineUser.userId} className={cx("left-container__user-profile", { 'user-profile--active': activeChat && activeChat.userId === onlineUser.userId })} onClick={() => handleSelectChat(onlineUser)}>
                    <div className="left-container__user-profile__icon"><Avatar googleId={onlineUser.userId} src={onlineUser.image} size="40" round={true} /> </div>
                    <div className="left-container__user-profile__name">{ userDetails.firstName || userDetails.lastName ? `${userDetails.firstName} ${userDetails.lastName}` : `${userDetails.name}`}</div>
                    {hasNotification && hasNotification[onlineUser.userId] && <div className="left-container__user-profile__notification-counts">{hasNotification && hasNotification[onlineUser.userId]}</div>}
                    <div className="left-container__user-profile__online-status" />

                </div>
            ) : <div className="left-container__chat-list__message"> No users online </div>
            }
        </div>
        <div className="left-container__chat-list">
        <div className="left-container__chat-list__header">Conversations</div>
        { activeChat ? <div className="left-container__chat-list__message">{activeChat.name}</div> :<div className="left-container__chat-list__message"> No previous conversations </div> } 
        </div>
    </div>)
}

import React, {useRef} from 'react'
import { TextField, Button, colors } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import cx from 'classname'
import http from 'axios'
import { useSelector } from 'react-redux'
import { Typography,AppBar,Card,CssBaseline,Container,Drawer } from '@material-ui/core';
import { makeStyles } from "@material-ui/core";
import { io } from 'socket.io-client'
import './style.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle , faDiceD6 ,faCommentDots, faSignOutAlt, faCog, faSearch, faComment, faCommentAlt } from '@fortawesome/free-solid-svg-icons'
import image from './goku.jpg';
import { userDetailsSelector } from "../../store/userDetails/selector";
import Avatar from 'react-avatar';


const getConnectedUsers = () => {
    return http.get('http://127.0.0.1:8000/getOnlineUsers')
}   

export const Home = ()=>{
    const socket = useRef(null);
    const chatRef = useRef(null)
    
    const userDetails = useSelector(userDetailsSelector)
    const [messageToSend, setMessageToSend] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [activeUser, setActiveUser] = useState({})
    const [messages, setMessages] = useState({})
    const [hasNotification, setHasNotification] = useState({})


    useEffect( () => {
        getConnectedUsers().then((res) => {
            const onlineUsersList = res.data.filter((userD) => userD.userId !== userDetails.userId)
            console.log(onlineUsersList)
            setOnlineUsers(onlineUsersList)
        }).catch((err) => {
            console.error(err)
        });
       
    },[userDetails.userId])

    useEffect(() => {
       
        socket.current = io("ws://localhost:8000", {
            path: '/ws/socket.io/',
           });
            socket.current.on('connect', function (event) {
                console.log('user is connected now');
                socket.current.emit('join', { data: { ...userDetails }});
            });
            socket.current.on('error', (err) => { 
                console.log(err)
            })
        socket.current.on('message-recieve' , (data) => {
            console.log(data)
            if(data.from !== activeUser.userId){
                setHasNotification((prev) => ({...prev, [data.from] : prev[data.from] ? prev[data.from] + 1 : 1}))
            }
            //setMessages((prev) => ({...prev, [data.to] : [...(prev[data.to] ? prev[data.to] : {}), {type : 'recieved', message : data.message}]}))
            setMessages((prev) => {
                if(prev[data.from]){
                    return { ...prev, [data.from] : [...prev[data.from], {type : 'recieved', message : data.message}]}
                }else{
                    return { ...prev, [data.from] : [{type : 'recieved', message : data.message}]}
                }
            })
            if(chatRef.current){
                chatRef.current.scrollTop = chatRef.current.scrollHeight;
            }
        })

        socket.current.on('user-disconnect', (data) => {
            console.log('user disconnected')
            setOnlineUsers((prev) => {
                return prev.filter((user) => user.userId !== data.userId)
            })
        })

        socket.current.on('user-joined' , (data) => {
                if(data.userId !== userDetails.userId){
                setOnlineUsers((prev) => {
                    const elementFound = prev.findIndex((user) => user.userId === data.userId)
                
                    if(elementFound === -1){
                        return [...prev, data]
                    }

                    return prev
                })
            }
        })

        return () => {
            if(socket.current)
                socket.current.disconnect();
        }
        
    },[activeUser.userId, userDetails])


    const handleSendClick = useCallback((e) => {
        if(!socket.current || !messageToSend.length ) return;



        socket.current.emit('send-message', {
            to: activeUser.userId,
            from : userDetails.userId,
            message : messageToSend
        })
        //setMessages((prev) => [...prev, {type : 'sent', message : messageToSend}])
       // setMessages((prev) => ({...prev, [activeUser.userId] : [ ...(prev[activeUser.userId] ? prev[activeUser.userId] : {}), {type : 'sent', message : messageToSend}]}))
       setMessages((prev) => {
        if(prev[activeUser.userId]){
            return { ...prev, [activeUser.userId] : [...prev[activeUser.userId], {type : 'sent', message : messageToSend}]}
        }else{
            return { ...prev, [activeUser.userId] : [{type : 'sent', message : messageToSend}]}
        }
    })
        setMessageToSend('')
    }, [activeUser.userId, messageToSend, userDetails.userId])

    console.log(messages)
   
    return(
        <div className="home-page">

            <div className="main-sidebar">
                <div className="App-name"></div>
                <div className="logo"><FontAwesomeIcon icon={faCommentDots} size="2x"/></div>
                <div className="nav">
                    <div className={ cx("nav-item", {'nav-item--active' : true})}><FontAwesomeIcon icon={faCommentAlt} size="lg"/></div>
                   
                    <div className="nav-bottom"> 
                    <div className="nav-item"><FontAwesomeIcon icon={faSignOutAlt} size="lg"/></div>
                    </div>
                </div>
            </div>



            <div className="left-container">
                <div className="my-profile">
                    <div className= "profile-image">
                        <Avatar googleId={userDetails.userId} src={userDetails.image} size="100" round={true} />  
                        {/* <img src={userDetails.image}/> */}
                    </div>
                    <div className="profile-name">
                        {userDetails.name}
                    </div>
                    <div className="my-acc">my account</div>
                </div>
                <div className="search">
                    <div className="search-icon"><FontAwesomeIcon icon={faSearch} size="lg" /></div>
                    <input className="search-bar" type="text" placeholder="search here">
                    </input>
                   
                </div>
                <div className="chat-list">
                    { onlineUsers.map((onlineUser) => 
                        <div id={onlineUser.userId} className={ cx("user-profile", {'user-profile--active': activeUser.userId === onlineUser.userId})}  onClick={() => {setActiveUser(onlineUser)
                                setHasNotification((prev) => {
                                    if(prev[onlineUser.userId]){
                                        delete prev[onlineUser.userId]
                                        return prev
                                    }
                                    return prev
                                })
                            }}>
                            <div className="user-profile__icon"><Avatar googleId={onlineUser.userId} src={onlineUser.image} size="50" round={true} /> </div>
                            <div className="user-profile__name">{onlineUser.name}</div>
                            { hasNotification[onlineUser.userId] && <div className="user-profile__notification-counts">{hasNotification[onlineUser.userId]}</div> }
                            <div className="user-profile__online-status" />
                            
                        </div>
                    )
                }
                </div>
            </div>





            { activeUser.userId && <div className="main-container">
                <div className="chat-header">
                    <div className="chat-header__icon" ><Avatar googleId={activeUser.userId} src={activeUser.image} size="100" round={true} /> </div>
                    <div className="chat-header__desc" >
                        <div className="chat-header__name">{ activeUser.name}</div>
                        <span className="chat-header__last-seen">Online</span>
                    </div>
                </div>

                <div className="chat-messages" ref={chatRef}>
                    
                    <div className="chat-messages__conversations">
                        { messages[activeUser.userId]?.map((message) => {
                            if(message.type === 'recieved'){
                                return  <div className="chat-messages__message_icon"><Avatar googleId={userDetails.userId} src={activeUser.image} size="20" round={true} /><div className="chat-messages__message-recieved">{message.message}</div></div>
                            }else{
                                return <div className="chat-messages__message-sent" >{message.message}</div>
                            }
                        })}
                       
                    </div>
                    
                </div>
                <footer className="chat-messages__send-message">
                      
                        <div className="chat-messages__input">
                        <input type="text" placeholder="Send something..." value={messageToSend} onKeyPress={(e) => {
                            if(e.key === 'Enter'){
                                handleSendClick()
                            }
                        }} onChange={({ target }) => setMessageToSend(target.value)}/>
                        </div>
                        <div className="chat-messages__send">
                            <Button variant='contained' color='primary' size='small' onClick={handleSendClick} >Send</Button>
                        </div>
                    </footer>
            </div>
}
        </div>
        
    )
}



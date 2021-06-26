
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
import { faUserCircle , faDiceD6 , faSignOutAlt, faCog, faSearch } from '@fortawesome/free-solid-svg-icons'
import image from './goku.jpg';
import { userDetailsSelector } from "../../store/userDetails/selector";



const socket = io("ws://localhost:8000", {
    path: '/ws/socket.io/',
   });


const getConnectedUsers = () => {
    return http.get('http://127.0.0.1:8000/getOnlineUsers')
}   

export const Home = ()=>{
    
    const userDetails = useSelector(userDetailsSelector)
    console.log(userDetails)
    const [messageToSend, setMessageToSend] = useState('');
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [activeUser, setActiveUser] = useState({})
    const [messages, setMessages] = useState([])


    useEffect( () => {
        getConnectedUsers().then((res) => {
            setOnlineUsers(res.data)
        }).catch((err) => {
            console.error(err)
        });
       
    },[])

    useEffect(() => {
        console.log("COnnecting ")
       
          
            socket.on('connect', function (event) {
                console.log('user is connected now');
                socket.emit('join', { data: { ...userDetails }});
            });
            socket.on('error', (err) => { 
                console.log(err)
            })
        socket.on('message-recieve' , (data) => {
            setMessages((prev) => [...prev, {type : 'recieved', message : data}])
        })
        
    },[userDetails])


    const handleSendClick = useCallback((e) => {
        socket.emit('send-message', {
            to: activeUser.userId,
            from : userDetails.userId,
            message : messageToSend
        })
        setMessages((prev) => [...prev, {type : 'sent', message : messageToSend}])
    }, [activeUser.userId, messageToSend, userDetails.userId])
   
    return(
        <div className="home-page">

            <div className="main-sidebar">
                <div className="App-name">Hellochat</div>
                <div className="logo"><FontAwesomeIcon icon={faDiceD6} size="2x"/></div>
                <div className="nav">
                    <div className="nav-item"><FontAwesomeIcon icon={faCog} size="lg"/></div>
                    <div className="nav-item"><FontAwesomeIcon icon={faCog} size="lg"/></div>
                    <div className="nav-item"><FontAwesomeIcon icon={faSignOutAlt} size="lg"/></div>
                    <div className="nav-bottom"> 
                    <div className="nav-item"><FontAwesomeIcon icon={faCog} size="lg"/></div>
                    <div className="nav-item"><FontAwesomeIcon icon={faSignOutAlt} size="lg"/></div>
                    </div>
                </div>
            </div>



            <div className="left-container">
                <div className="my-profile">
                    <div className= "profile-image"></div>
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
                        <div id={onlineUser.userId} className={ cx("user-profile", {'user-profile--active': activeUser.userId === onlineUser.userId})}  onClick={() => setActiveUser(onlineUser)}>
                            <div className="user-profile__icon"><img src={image} /></div>
                            <div className="user-profile__name">{onlineUser.name}</div>
                            <div className="user-profile__online-status" />
                        </div>
                    )
                }
                </div>
            </div>





            <div className="main-container">
                <div className="chat-header">
                    <div className="chat-header__icon" ><img src={image} /></div>
                    <div className="chat-header__desc" >
                        <div className="chat-header__name">{ activeUser.name}</div>
                        <span className="chat-header__last-seen">Online</span>
                    </div>
                </div>

                <div className="chat-messages">
                    
                    <div className="chat-messages__conversations">
                        { messages.map((message) => {
                            if(message.type === 'recieved'){
                                return <div className="chat-messages__message-recieved">{message.message}</div>
                            }else{
                                return <div className="chat-messages__message-sent" >{message.message}</div>
                            }
                        })}
                       
                    </div>
                    <div className="chat-messages__send-message">
                      
                        <div className="chat-messages__input">
                        <input type="text" placeholder="Send something..." onChange={({ target }) => setMessageToSend(target.value)}/>
                        </div>
                        <div className="chat-messages__send">
                            <Button variant='contained' color='primary' size='small' onClick={handleSendClick} >Send</Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        
    )
}



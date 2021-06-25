
import { TextField, Button, colors } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Typography,AppBar,Card,CssBaseline,Container,Drawer } from '@material-ui/core';
import { makeStyles } from "@material-ui/core";
import './style.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle , faDiceD6 , faSignOutAlt, faCog, faSearch } from '@fortawesome/free-solid-svg-icons'
import image from './goku.jpg';

export const Home = ()=>{

   
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
                        Ashish dabral
                    </div>
                    <div className="my-acc">my account</div>
                </div>
                <div className="search">
                    <div className="search-icon"><FontAwesomeIcon icon={faSearch} size="lg" /></div>
                    <input className="search-bar" type="text" placeholder="search here">
                    </input>
                   
                </div>
                <div className="chat-list">
                    <div className="user-profile">
                        <div className="user-profile__icon"><img src={image} /></div>
                        <div className="user-profile__name">Akhil Dabral</div>
                        <div className="user-profile__online-status" />
                    </div>
                    <div className="user-profile">
                        <div className="user-profile__icon"><img src={image} /></div>
                        <div className="user-profile__name">Akhil Dabral</div>
                        <div className="user-profile__online-status__online" />
                    </div>
                    <div className="user-profile">
                        <div className="user-profile__icon"><img src={image} /></div>
                        <div className="user-profile__name">Akhil Dabral</div>
                        <div className="user-profile__online-status" />
                    </div>
                    <div className="user-profile">
                        <div className="user-profile__icon"><img src={image} /></div>
                        <div className="user-profile__name">Akhil Dabral</div>
                        <div className="user-profile__online-status" />
                    </div>
                    <div className="user-profile">
                        <div className="user-profile__icon"><img src={image} /></div>
                        <div className="user-profile__name">Akhil Dabral</div>
                        <div className="user-profile__online-status" />
                    </div>
                </div>
            </div>





            <div className="main-container">
                <div className="chat-header">
                    <div className="chat-header__icon" ><img src={image} /></div>
                    <div className="chat-header__desc" >
                        <div className="chat-header__name">Akhil Dabral</div>
                        <span className="chat-header__last-seen">Online</span>
                    </div>
                </div>

                <div className="chat-messages">
                    
                    <div className="chat-messages__conversations">
                        <div className="chat-messages__message-recieved"> ffafafsaf sgdsdagadsg das g</div>
                        <div className="chat-messages__message-recieved"> ffafafsaf sgdsdagadsg das g</div>
                        <div className="chat-messages__message-recieved"> ffafafsaf sgdsdagadsg das g</div>
                        <div className="chat-messages__message-sent" > dfgds ghfdhfdsh fdh </div>
                        <div className="chat-messages__message-recieved"> ffafafsaf sgdsdagadsg das g</div>
                        <div className="chat-messages__message-recieved"> ffafafsaf sgdsdagadsg das g</div>
                        <div className="chat-messages__message-sent" > dfgds ghfdhfdsh fdh </div>
                        <div className="chat-messages__message-sent" > dfgds ghfdhfdsh fdh </div>
                        <div className="chat-messages__message-sent" > dfgds ghfdhfdsh fdh </div>
                    </div>
                    <div className="chat-messages__send-message">
                      
                        <div className="chat-messages__input">
                        <input type="text" placeholder="Send something..." />
                        </div>
                        <div className="chat-messages__send">
                            <Button variant='contained' color='primary' size='small' >Send</Button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        
    )
}



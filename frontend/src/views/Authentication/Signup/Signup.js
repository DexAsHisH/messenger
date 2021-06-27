import React, { useState } from 'react';
import { TextField, Button, Card, Container,Link } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import http from 'axios';



export const Signup = () => {


    const [username, setUserName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const history = useHistory();


    const handleSignIn = () => {

        console.log('signing');
        http.post('http://127.0.0.1:8000/signup', { username: username, email: email, password: password }).then((response) => {
            history.push({pathname : '/'})
        }).catch((err) => {
            console.log("Error", err)
        })
    }




    return <div className="container"> <Card className="user-login">


        <h1 className="heading">Register</h1>


        <div className="usernameBar">
            <TextField type='username' className="input_field" variant='outlined' placeholder='username...' size= 'small' onChange={({ target }) => setUserName(target.value)} />
        </div>


        <div className="emailBar">
            <TextField type='email' className="input_field" variant='outlined' placeholder='Email...' size= 'small' onChange={({ target }) => setEmail(target.value)} />
        </div>

        <div className="passBar">
            <TextField type='password' className="input_field" variant='outlined' placeholder='Password...' size= 'small' onChange={({ target }) => setPassword(target.value)} />
        </div>


        <div className="submit">
            <Button variant='contained' color='primary' size='large' onClick = {handleSignIn}>Sign in</Button>
        </div>

    </Card></div>

}
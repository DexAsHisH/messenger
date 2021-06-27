import React, { useState } from 'react';
import { TextField, Button, Card,Link } from '@material-ui/core'
import http from 'axios'
import { useDispatch } from 'react-redux';
import { GoogleLogin } from 'react-google-login';
import './styles.scss'

import { useHistory } from "react-router-dom";
import { setAuthenticated } from '../../../store/authentication';
import { setUserDetails } from '../../../store/userDetails';



export const Login = () => {

    const [username, setUserName] = useState();
    const [password, setPassword] = useState();
    const history = useHistory();
    const dispatch = useDispatch();

    const responseGoogle = (response) => {
        console.log(response);
        dispatch(setAuthenticated(true))
        const googleresponse = {
            name: response.profileObj.name,
                 email: response.profileObj.email,
                 token: response.googleId,
                 image: response.profileObj.imageUrl,
                 userId: response.googleId,
               };
            // http.post('http://127.0.0.1:8000/login', { username: googleresponse.name, password: "password" }).then((response) => {
            // console.log(response.data)
            // history.push({pathname : '/', state : googleresponse})
            // }).catch((err) => {
            // console.log("Error", err)
            // })
        console.log(googleresponse)
        dispatch(setUserDetails(googleresponse))
        history.push({pathname : '/', state : googleresponse})
        
      }
    
    const responsefailure = (response) =>{
        console.log(response);

    }


    const handleLogin = () => {
        console.log('signing');

        http.post('http://127.0.0.1:8000/login', { username: username, password: password }).then((response) => {
            dispatch(setAuthenticated(true))
            
            console.log(response.data)
            const googleresponse = {
                name:response.data.username,
                     email: '',
                     token: '',
                     image: `https://avatars.dicebear.com/api/human/${Math.floor(Math.random() * 5000)}.svg`,
                     userId: response.data.userid,
                   };
                   console.log(googleresponse)
                   dispatch(setUserDetails(googleresponse))
            history.push({pathname : '/', state : googleresponse})
        }).catch((err) => {
            console.log("Error", err)
        })
    }

    
    return <div className="container"> <Card className="user-login">
    
        <h1 className="heading">
            Welcome !!!</h1>

        <div className="emailBar">
        <TextField type='email' variant='outlined' placeholder='email...' size= 'small' onChange={({ target }) => setUserName(target.value)} />
        </div>

        <div className="passBar">
        <TextField type='password' variant='outlined' placeholder='Password...' size= 'small' onChange={({ target }) => setPassword(target.value)} />
        </div>

        <div className= "forgotpass">
            <Link color="primary">
                forgot password?
            
            </Link>
            
        </div>

        
        <div className="submit">
        <Button variant='contained' color='primary' size='large' onClick={handleLogin}>Login</Button>
        </div>

        <div className="createacc">    
            <Link href="http://127.0.0.1:3000/signup" color="primary">
                create a new account
            </Link>
            
        </div>

        <GoogleLogin
        clientId="1016226795980-5dls61tqvm55jmlsnva6lor2riddt993.apps.googleusercontent.com"
        buttonText="Login"
        onSuccess={responseGoogle}
        onFailure={responsefailure}
        cookiePolicy={'single_host_origin'}
        />

    </Card></div>
}

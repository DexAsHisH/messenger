import React, { useState } from 'react';
import { TextField, Button, Card, Container,Link } from '@material-ui/core';




export const Usersignup = () => {


    const [username, setUserName] = useState();
    const [password, setPassword] = useState();

return <div className="container"> <Card className="user-login">


<h1 className="heading">Register</h1>


<div className="username">
<TextField type='username' variant='outlined' placeholder='username...' size= 'small' onChange={({ target }) => setUserName(target.value)} />
</div>


<div className="emailBar">
<TextField type='email' variant='outlined' placeholder='Email...' size= 'small' onChange={({ target }) => setUserName(target.value)} />
</div>

<div className="passBar">
<TextField type='password' variant='outlined' placeholder='Password...' size= 'small' onChange={({ target }) => setPassword(target.value)} />
</div>


<div className="submit">
<Button variant='contained' color='primary' size='large'>Sign In</Button>
</div>

</Card></div>

}

import { TextField, Button } from "@material-ui/core";
import { useLocation } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';



export const Home = (props) => {

    const [text, setText] = useState();
    const [messages, setMessages] = useState([]);
    const location = useLocation()

    const getSocketUrl = useCallback(() => {
        return new Promise((resolve, reject) => {
            if (props.userid) {
                resolve(`ws://localhost:8000/ws/${props.userid}`);
            }
            resolve(`ws://localhost:8000/ws/2`);
        });
    }, [props.userid]);


    console.log(props);

    const {
        sendMessage,
        lastMessage,
        readyState,
    } = useWebSocket(getSocketUrl);

    useEffect(() => {
        if (lastMessage) {
            setMessages((prevValue) => {

                return [...prevValue, lastMessage.data]



            })
        }

    }, [lastMessage])

    const handleSend = () => {

        sendMessage(text);

    }

    return (

        <div>
            <h1>
                {location.state.name}
            </h1>
            <img src={location.state.image} />

            <TextField type='text' variant='outlined' placeholder='text...' size='small' onChange={({ target }) => setText(target.value)}></TextField>

            <Button variant='contained' color='Secondary' size='large' onClick={handleSend}>Send</Button>

            {messages.map((message) => {

                return <div>{message}</div>

            })}




        </div>

    )
}




import React, { useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import MessageRounded from '@mui/icons-material/MessageRounded';
import Person from '@mui/icons-material/Person';
import { userDetailsSelector } from "../../store/userDetails/selector";
import { Navigation, INavigationItem } from '../../components'
import './style.scss'
import { Route, Switch } from 'react-router-dom';
import { Messages } from './components/Messages/Messages';
import { Websocket } from '../../services/websocket';
import { MessageContextProvider } from './context';
import { Profile } from './components/Profile';



export const Home = () => {

    const userDetails = useSelector(userDetailsSelector)

    useEffect(() => {
        if (userDetails) {
            Websocket.getInstance().connect(userDetails);
        }

        return () => {
            Websocket.getInstance().disconnect();
        }
    }, [userDetails])


    const navigationOptions: INavigationItem[] = useMemo(() => [
        {
            id: 'messages',
            icon: <MessageRounded />,
            onClick: () => { },
            hidden: false,
            target: '/messages',
        },
        {
            id: 'profile',
            icon : <Person />,
            onClick : ()=>{},
            hidden: false,
            target: '/profile',
        }
    ], [])

    return (
        <div className="home-page">
            <MessageContextProvider>
                <Navigation items={navigationOptions} />
                <Switch>
                    <Route path="/messages" component={Messages} />
                    <Route path="/profile" component={Profile} />
                    { /* Add new path here */}
                </Switch>
            </MessageContextProvider>
        </div>

    )
}



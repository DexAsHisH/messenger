import React from "react";
import { useSelector } from 'react-redux';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { Home } from "./views/Home";
import { Login } from "./views/Authentication/Login";
import { Signup } from "./views/Authentication/Signup/Signup";
import { isAuthenticatedSelector } from "./store/authentication/selector";



export const App = () => {

  const isAuthenticated = useSelector(isAuthenticatedSelector);

  return (
    <Router>
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/signup' component={Signup} />
        <Route path='/' render={() => {
          if (!isAuthenticated) {
            return <Redirect to='/login' />;
          } else {
            return (<div><Home />
              <Redirect to={'/messages'} /> </div>)
          }

        }} />
      </Switch>
    </Router>
  )
}
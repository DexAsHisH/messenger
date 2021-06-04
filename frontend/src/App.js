import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { Home } from "./views/Home";
import { UserLogin } from "./views/UserLogin";
import { Usersignup } from "./Usersignup"
  

export const App =()=>{

    return(

        <Router> 

            <Switch>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/signup">
            <Usersignup/>
          </Route>
          <Route path="/">
            <UserLogin/>
          </Route>

        </Switch>


        </Router>


    )
}
import React from "react";

// We use Route in order to define the different routes of our application
import { Route } from "react-router-dom";

import Navbar from "./components/navbar";
import Edit from "./components/edit";
import Create from "./components/create";
import Home from "./components/home";
import Day  from "./components/day";
import All  from "./components/all";
import DNB  from "./components/dnb";
import History  from "./components/history";
import Login from "./components/Login"
import useToken from "./components/useToken"


function App() {
  const { token, setToken } = useToken();

  if(!token) {
    return <Login setToken={setToken} />
  }
  return (
    <div>
      <Navbar/>
        <Route exact path="/">
            <Home />
        </Route>
        <Route exact path="/all">
            <All token={token}/>
        </Route>

        <Route exact path="/dnb">
            <DNB />
        </Route>
        <Route exact path="/history">
            <History />
        </Route>
        <Route path="/edit/:id">
            <Edit token={token}/>
        </Route>
        <Route path="/day/:date">
            <Day token={token}/>
        </Route>
        <Route path="/create">
            <Create token={{token}}/>
        </Route>
      </div>
  );
}

export default App;

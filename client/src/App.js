import React from "react";
import { Route } from "react-router-dom";

import MenuAppBar from "./components/MenuAppBar";
import Register from "./components/Register";
import Login from "./components/Login";
import Users from "./components/Users";

import "./App.css";

function App() {
  return (
    <div className="App">
      <MenuAppBar />
      <Route exact path="/" render={props => <Login {...props} />} />
      <Route exact path="/register" component={Register} />
      <Route path="/users" component={Users} />
    </div>
  );
}

export default App;
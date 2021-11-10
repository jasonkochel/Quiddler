import React, { useState } from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Game from "./components/Game";
import GameList from "./components/GameList";
import Login from "./components/Login";

function App() {
  const storedAuth = {
    token: localStorage.getItem("token"),
    name: localStorage.getItem("name")
  };

  const [auth, setAuth] = useState(storedAuth);

  return (
    <Router>
      <div className="App">
        <Route
          exact
          path="/"
          render={props => <Login {...props} auth={auth} setAuth={setAuth} />}
        />
        <Route
          exact
          path="/games/:id"
          render={props => <Game {...props} auth={auth} />}
        />
        <Route
          exact
          path="/games"
          render={props => <GameList {...props} auth={auth} />}
        />
      </div>
    </Router>
  );
}

export default App;

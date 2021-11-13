import React, { useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Game from "./components/Game";
import GameList from "./components/GameList";
import Login from "./components/Login";

function App() {
  const storedAuth = {
    token: localStorage.getItem("token"),
    name: localStorage.getItem("name"),
  };

  const [auth, setAuth] = useState(storedAuth);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            exact
            path="/"
            element={<Login auth={auth} setAuth={setAuth} />}
          />
          <Route exact path="/games/:gameId" element={<Game auth={auth} />} />
          <Route exact path="/games" element={<GameList auth={auth} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import { connect } from "react-redux";
import { HashRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Game from "./components/Game";
import GameList from "./components/GameList";
import Login from "./components/Login";

function App({ auth }) {
  return (
    <Router>
      <div className="App">
        <Route exact path="/" component={Login} />
        <Route exact path="/games/:id" component={Game} />
        <Route exact path="/games" component={GameList} />
      </div>
    </Router>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(
  mapStateToProps,
  null
)(App);

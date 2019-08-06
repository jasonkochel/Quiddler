import React from "react";
import { connect } from "react-redux";
import logo from "./logo.svg";
import "./App.css";
import Login from "./components/Login";
import { tokenIsValid } from "./ducks/authDuck";

function App({ authState }) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {tokenIsValid(authState) ? `Logged In as ${authState.name}` : <Login />}
      </header>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    authState: state.authReducer
  };
};

export default connect(
  mapStateToProps,
  null
)(App);

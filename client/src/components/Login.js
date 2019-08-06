import React, { Component } from "react";
import { GoogleLogin } from "react-google-login";
import { connect } from "react-redux";
import { login } from "../ducks/authDuck";
import config from "../config.json";

class Login extends Component {
  onFailure = error => {
    alert(error);
  };

  googleResponse = response => {
    const tokenBlob = new Blob(
      [JSON.stringify({ tokenId: response.tokenId }, null, 2)],
      { type: "application/json" }
    );
    const options = {
      method: "POST",
      body: tokenBlob,
      mode: "cors",
      cache: "default"
    };
    fetch(config.GOOGLE_AUTH_CALLBACK_URL, options).then(r => {
      r.json().then(result => {
        this.props.login(result);
      });
    });
  };

  render() {
    return (
      <GoogleLogin
        clientId={config.GOOGLE_CLIENT_ID}
        buttonText="Google Login"
        onSuccess={this.googleResponse}
        onFailure={this.onFailure}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: token => {
      dispatch(login(token));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

import React from "react";
import { GoogleLogin } from "react-google-login";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { login, tokenIsValid } from "../ducks/authDuck";

const googleCallbackUrl = process.env.REACT_APP_API_BASE_URL + "/auth/google";

const Login = ({ auth, login }) => {
  const onFailure = error => {
    alert(error);
  };

  const googleResponse = response => {
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
    fetch(googleCallbackUrl, options).then(r => {
      r.json().then(result => {
        login(result.token);
      });
    });
  };

  return tokenIsValid(auth.token) ? (
    <Redirect to="/games" />
  ) : (
    <GoogleLogin
      clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
      buttonText="Google Login"
      onSuccess={googleResponse}
      onFailure={onFailure}
    />
  );
};

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = {
  login
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);

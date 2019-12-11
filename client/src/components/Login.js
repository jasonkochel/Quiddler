import jwt from "jsonwebtoken";
import React from "react";
import { GoogleLogin } from "react-google-login";
import { Redirect } from "react-router-dom";

const googleCallbackUrl = process.env.REACT_APP_API_BASE_URL + "/auth/google";

const tokenIsValid = token => {
  if (token) {
    var decodedToken = jwt.decode(token);
    var dateNow = new Date();
    if (decodedToken.exp > dateNow.getTime() / 1000) return true;
    else return false;
  }
  return false;
};

const Login = ({ auth, setAuth }) => {
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
    fetch(googleCallbackUrl, options).then(resp => {
      resp.json().then(result => {
        const token = result.token;
        const name = jwt.decode(token).name;

        localStorage.setItem("token", token);
        localStorage.setItem("name", name);

        setAuth({ token, name });
      });
    });
  };

  return auth && tokenIsValid(auth.token) ? (
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

export default Login;

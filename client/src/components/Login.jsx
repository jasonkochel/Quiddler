import jwt_decode from "jwt-decode";
import React from "react";
import { GoogleLogin } from "react-google-login";
import { Navigate } from "react-router-dom";

const googleCallbackUrl = import.meta.env.VITE_API_BASE_URL + "/auth/google";

const tokenIsValid = (token) => {
  if (token) {
    var decodedToken = jwt_decode(token);
    var dateNow = new Date();
    if (decodedToken.exp > dateNow.getTime() / 1000) return true;
    else return false;
  }
  return false;
};

const Login = ({ auth, setAuth }) => {
  const onFailure = (error) => {
    console.error(error);
    alert("Login failed; see error console");
  };

  const googleResponse = (response) => {
    const tokenBlob = new Blob(
      [JSON.stringify({ tokenId: response.tokenId }, null, 2)],
      { type: "application/json" }
    );
    const options = {
      method: "POST",
      body: tokenBlob,
      mode: "cors",
      cache: "default",
    };
    fetch(googleCallbackUrl, options).then((resp) => {
      resp.json().then((result) => {
        const token = result.token;
        const name = jwt_decode(token).name;

        localStorage.setItem("token", token);
        localStorage.setItem("name", name);

        setAuth({ token, name });
      });
    });
  };

  return auth && tokenIsValid(auth.token) ? (
    <Navigate to="/games" />
  ) : (
    <GoogleLogin
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
      buttonText="Google Login"
      onSuccess={googleResponse}
      onFailure={onFailure}
    />
  );
};

export default Login;

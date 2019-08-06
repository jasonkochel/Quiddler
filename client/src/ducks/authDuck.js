import jwt from "jsonwebtoken";

const LOGIN = "auth/LOGIN";

const initialState = {
  token: "",
  name: "",
  isAuthenticated: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      state = {
        ...state,
        token: action.payload.token,
        name: action.payload.name,
        isAuthenticated: true
      };
      break;

    default:
      break;
  }
  return state;
};

export function login(authResult) {
  return dispatch => {
    dispatch({
      type: LOGIN,
      payload: { token: authResult.token, name: authResult.name }
    });
  };
}

export function tokenIsValid(token) {
  if (token.isAuthenticated) {
    var decodedToken = jwt.decode(token.token);
    var dateNow = new Date();
    if (decodedToken.exp > dateNow.getTime() / 1000) return true;
    else return false;
  }
  return false;
}

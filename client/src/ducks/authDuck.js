import jwt from "jsonwebtoken";

const LOGIN = "auth/LOGIN";

const initialState = {
  token: localStorage.getItem("token"),
  name: localStorage.getItem("name")
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      state = {
        ...state,
        token: action.payload.token,
        name: action.payload.name
      };
      break;

    default:
      break;
  }
  return state;
};

export function login(token) {
  return dispatch => {
    const name = jwt.decode(token).name;

    localStorage.setItem("token", token);
    localStorage.setItem("name", name);

    dispatch({
      type: LOGIN,
      payload: { token, name }
    });
  };
}

export function tokenIsValid(token) {
  if (token) {
    var decodedToken = jwt.decode(token);
    var dateNow = new Date();
    if (decodedToken.exp > dateNow.getTime() / 1000) return true;
    else return false;
  }
  return false;
}

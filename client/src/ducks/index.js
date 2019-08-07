import { combineReducers } from "redux";
import auth from "./authDuck";
import game from "./gameDuck";

export default combineReducers({ auth, game });

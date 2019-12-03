import { combineReducers } from "redux";
import auth from "./authDuck";
import deck from "./deckDuck";
import game from "./gameDuck";

export default combineReducers({ auth, game, deck });

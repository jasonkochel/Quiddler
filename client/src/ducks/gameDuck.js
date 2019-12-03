import api from "../api";
import { MOVETYPES } from "../const";

const LIST_LOADED = "games/LIST_LOADED";
const GAME_LOADED = "games/LOADED";

const initialState = {
  loading: false,
  error: null,
  gameList: [],
  game: {}
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LIST_LOADED:
      state = {
        ...state,
        gameList: action.payload
      };
      break;

    case GAME_LOADED:
      state = {
        ...state,
        game: action.payload
      };
      break;

    default:
      break;
  }
  return state;
};

export const loadList = () => {
  return async dispatch => {
    var res = await api.get("games");
    dispatch({ type: LIST_LOADED, payload: res.data });
  };
};

export const loadGame = id => {
  return async dispatch => {
    var res = await api.get(`games/${id}`);
    dispatch({ type: GAME_LOADED, payload: res.data });
  };
};

export const createGame = () => {
  return async dispatch => {
    await api.post("games");
    var res = await api.get("games");
    dispatch({ type: LIST_LOADED, payload: res.data });
  };
};

export const joinGame = id => {
  return async dispatch => {
    var res = await api.post(`games/${id}/players?startGame=true`);
    dispatch({ type: GAME_LOADED, payload: res.data });
  };
};

export const sortHand = newHand => {
  return async (dispatch, getState) => {
    const id = getState().game.game.gameId;
    const data = newHand.map(c => c.cardId);
    await api.put(`games/${id}/hand?newHand=${data.toString()}`);

    //var res = await api.put(`games/${id}/hand?newHand=${data.toString()}`);
    //dispatch({ type: GAME_LOADED, payload: res.data });
  };
};

export const makeMove = (moveType, moveData) => {
  return async (dispatch, getState) => {
    const id = getState().game.game.gameId;

    const move = {
      type: moveType,
      discard:
        moveType === MOVETYPES.DISCARD || moveType === MOVETYPES.GO_OUT
          ? moveData.cardToDiscard
          : null,
      words: moveType === MOVETYPES.GO_OUT ? moveData.words : null
    };

    var res = await api.put(`games/${id}`, move);
    dispatch({ type: GAME_LOADED, payload: res.data });
  };
};

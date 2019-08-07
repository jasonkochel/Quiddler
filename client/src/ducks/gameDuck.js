import api from "../api";

const AJAX_STARTED = "ajax/STARTED";
const AJAX_SUCCESS = "ajax/SUCCESS";
const AJAX_ERROR = "ajax/ERROR";

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
    case AJAX_STARTED:
      state = { ...state, loading: true, error: null };
      break;

    case AJAX_SUCCESS:
      state = { ...state, loading: false };
      break;

    case AJAX_ERROR:
      state = { ...state, loading: false, error: action.payload };
      break;

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
    dispatch({ type: AJAX_STARTED });
    try {
      var res = await api.get("games");
      dispatch({ type: AJAX_SUCCESS });
      dispatch({ type: LIST_LOADED, payload: res.data });
    } catch (err) {
      dispatch({ type: AJAX_ERROR, payload: err.message });
    }
  };
};

export const loadGame = id => {
  return async dispatch => {
    dispatch({ type: AJAX_STARTED });
    try {
      var res = await api.get(`games/${id}`);
      dispatch({ type: AJAX_SUCCESS });
      dispatch({ type: GAME_LOADED, payload: res.data });
    } catch (err) {
      dispatch({ type: AJAX_ERROR, payload: err.message });
    }
  };
};

export const createGame = () => {
  return async dispatch => {
    dispatch({ type: AJAX_STARTED });
    try {
      await api.post("games");
      var res = await api.get("games");
      dispatch({ type: AJAX_SUCCESS });
      dispatch({ type: LIST_LOADED, payload: res.data });
    } catch (err) {
      dispatch({ type: AJAX_ERROR, payload: err.message });
    }
  };
};

export const joinGame = id => {
  return async dispatch => {
    dispatch({ type: AJAX_STARTED });
    try {
      var res = await api.put(`games/${id}/players?startGame=true`);
      dispatch({ type: AJAX_SUCCESS });
      dispatch({ type: GAME_LOADED, payload: res.data });
    } catch (err) {
      dispatch({ type: AJAX_ERROR, payload: err.message });
    }
  };
};

export const makeMove = id => {
  return async dispatch => {
    dispatch({ type: AJAX_STARTED });
    try {
      var res = await api.put(`games/${id}/players?startGame=true`);
      dispatch({ type: AJAX_SUCCESS });
      dispatch({ type: GAME_LOADED, payload: res.data });
    } catch (err) {
      dispatch({ type: AJAX_ERROR, payload: err.message });
    }
  };
};

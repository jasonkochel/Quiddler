import api from "../api";

const VALUES_LOADED = "deck/VALUES_LOADED";

const initialState = {
  cardValues: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case VALUES_LOADED:
      state = {
        cardValues: action.payload
      };
      break;

    default:
      break;
  }
  return state;
};

export function getCardValues() {
  return async dispatch => {
    var res = await api.get("cardvalues");
    dispatch({ type: VALUES_LOADED, payload: res.data });
  };
}

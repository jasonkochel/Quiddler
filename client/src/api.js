import axios from "axios";
import { MOVETYPES } from "./const";

var api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL
});

// TODO add error interceptors - https://codepen.io/teroauralinna/pen/vPvKWe

api.interceptors.request.use(
  config => {
    if (!config.headers.Authorization) {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  error => Promise.reject(error)
);

const loadList = async () => {
  const res = await api.get("games");
  return res.data;
};

const createGame = async () => {
  await api.post("games");
};

const joinGame = async gameId => {
  await api.post(`games/${gameId}/players?startGame=true`);
};

const loadGame = async gameId => {
  var res = await api.get(`games/${gameId}`);
  return res.data;
};

const sortHand = async (gameId, newHand) => {
  const data = newHand.map(c => c.cardId);
  var res = await api.put(`games/${gameId}/hand?newHand=${data.toString()}`);
  return res.data;
};

const makeMove = async (gameId, moveType, moveData) => {
  const move = {
    type: moveType,
    discard:
      moveType === MOVETYPES.DISCARD || moveType === MOVETYPES.GO_OUT
        ? moveData.cardToDiscard
        : null,
    words: moveType === MOVETYPES.GO_OUT ? moveData.words : null
  };

  var res = await api.put(`games/${gameId}`, move);
  return res.data;
};

export { loadList, createGame, joinGame, loadGame, sortHand, makeMove };

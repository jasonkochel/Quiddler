import axios from "axios";
import { MOVETYPES } from "./const";

var api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// TODO add error interceptors - https://codepen.io/teroauralinna/pen/vPvKWe

api.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const loadList = async () => {
  const res = await api.get("games");
  return res.data;
};

const createGame = async () => {
  const res = await api.post("games");
  return res.data;
};

const joinGame = async (gameId) => {
  const res = await api.post(`games/${gameId}/players`);
  return res.data;
};

const startGame = async (gameId) => {
  const res = await api.post(`games/${gameId}/start`);
  return res.data;
};

const loadGame = async (gameId) => {
  const res = await api.get(`games/${gameId}`);
  return res.data;
};

const sortHand = async (gameId, newHand) => {
  const data = newHand.map((c) => c.cardId);
  const res = await api.put(`games/${gameId}/hand?newHand=${data.toString()}`);
  return res.data;
};

const makeMove = async (gameId, moveType, moveData) => {
  const move = {
    type: moveType,
    discard:
      moveType === MOVETYPES.DISCARD || moveType === MOVETYPES.GO_OUT
        ? moveData.cardToDiscard
        : null,
    words: moveType === MOVETYPES.GO_OUT ? moveData.words : null,
  };

  const res = await api.put(`games/${gameId}`, move);
  return res.data;
};

const checkWords = async (words) => {
  const res = await api.get(`games/dictionary?words=${words.toString()}`);
  return res.data;
};

export {
  loadList,
  createGame,
  joinGame,
  loadGame,
  startGame,
  sortHand,
  makeMove,
  checkWords,
};

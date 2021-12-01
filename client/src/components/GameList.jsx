import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createGame, joinGame, loadList, startGame } from "../api";

const hydrateGame = (g, name) => {
  return {
    ...g,
    canPlay: g.hasStarted && g.players.includes(name),
    canJoin: !g.hasStarted && !g.players.includes(name),
    canStart: !g.hasStarted && g.players.length > 1,
  };
};

const ActionButton = ({ onClick, text }) => (
  <button
    className="px-2 py-1 bg-gray-200 border border-gray-600 rounded-md"
    onClick={onClick}
  >
    {text}
  </button>
);

const GameList = ({ auth }) => {
  const navigate = useNavigate();

  const [games, setGames] = useState();

  useEffect(() => {
    loadList().then((res) => setGames(res));
  }, []);

  const handlePlayGame = (id) => navigate(`/games/${id}`);

  const handleJoinGame = (id) => joinGame(id).then((res) => setGames(res));

  const handleStartGame = (id) => startGame(id).then(() => handlePlayGame(id));

  const handleCreateGame = () => createGame().then((res) => setGames(res));

  if (!games) return null;

  return (
    <div className="w-5/6 max-w-xs">
      <div className="flex flex-col">
        <div className="my-2 text-lg font-bold text-white">Games</div>
        {games
          .map((g) => hydrateGame(g, auth.name))
          .map((g) => (
            <div
              key={g.gameId}
              className="flex flex-row justify-between px-4 py-2 bg-white border border-gray-300"
            >
              <div className="my-auto text-left">
                <p className="text-base">{g.players.join(", ")}</p>
                {!g.hasStarted && (
                  <p className="text-xs text-gray-600">Not Started</p>
                )}
              </div>
              <div className="my-auto">
                {g.canPlay ? (
                  <ActionButton
                    onClick={() => handlePlayGame(g.gameId)}
                    text="Play"
                  />
                ) : g.canJoin ? (
                  <ActionButton
                    onClick={() => handleJoinGame(g.gameId)}
                    text="Join"
                  />
                ) : g.canStart ? (
                  <ActionButton
                    onClick={() => handleStartGame(g.gameId)}
                    text="Start"
                  />
                ) : null}
              </div>
            </div>
          ))}
        <div className="mt-4 text-lg font-bold">
          <button
            className="px-2 py-1 text-white bg-green-600 border border-white rounded "
            onClick={handleCreateGame}
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameList;

import React from "react";
import { useNavigate } from "react-router";
import { GAMESTATUS, GOINGOUTSTATUS } from "../const";

const messages = {
  [GAMESTATUS.PENDING_TURN]: "Waiting for $ to Play",
  [GAMESTATUS.PENDING_DISCARD]: "Discard or Go Out",
  [GAMESTATUS.PENDING_DRAW]: "Draw from Discard or Deck",
  [GAMESTATUS.PENDING_NEXT_ROUND]: "The Round is Over",
  [GAMESTATUS.PENDING_OPPONENT_OUT]: "Waiting for $ to Go Out",
  [GAMESTATUS.GAME_OVER]: "Game Over!",
};

const NEXT_ROUND_STATUS = {
  NONE: "NONE",
  PROMPT: "PROMPT",
  WAIT: "WAIT",
};

const Status = ({ game, status, goingOutStatus, onStartNextRound }) => {
  const navigate = useNavigate();

  const bgColor =
    status === GAMESTATUS.PENDING_TURN
      ? "bg-pink-300"
      : status === GAMESTATUS.PENDING_OPPONENT_OUT
      ? "bg-blue-300"
      : "bg-green-300";

  let nextRoundStatus = NEXT_ROUND_STATUS.NONE;
  if (status === GAMESTATUS.PENDING_NEXT_ROUND) {
    if (goingOutStatus.readyForNextRound) {
      nextRoundStatus = NEXT_ROUND_STATUS.WAIT;
    } else {
      nextRoundStatus = NEXT_ROUND_STATUS.PROMPT;
    }
  }

  return (
    <>
      {game.roundStatus === "MustGoOut" && goingOutStatus.status !== GOINGOUTSTATUS.GONE && (
        <div className={`text-center p-4 mt-4 w-11/12 mx-auto rounded bg-red-500`}>
          The round is ending. You must go out.
        </div>
      )}

      <div className={`text-center p-4 my-4 w-11/12 rounded mx-auto ${bgColor}`}>
        {messages[status].replace("$", game.whoseTurn)}
        {nextRoundStatus === NEXT_ROUND_STATUS.PROMPT ? (
          <>
            <br />
            <a className="underline cursor-pointer" onClick={onStartNextRound}>
              I am ready for the next round
            </a>
          </>
        ) : nextRoundStatus === NEXT_ROUND_STATUS.WAIT ? (
          <>
            <br />
            <span>Waiting for opponents to be ready for the next round...</span>
          </>
        ) : status === GAMESTATUS.GAME_OVER ? (
          <>
            <br />
            <a className="underline cursor-pointer" onClick={() => navigate("/games")}>
              Play Again
            </a>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Status;

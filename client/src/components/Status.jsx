import React from "react";
import { GAMESTATUS, GOINGOUTSTATUS } from "../const";

const messages = {
  [GAMESTATUS.PENDING_TURN]: "Waiting for $ to Play",
  [GAMESTATUS.PENDING_DISCARD]: "Discard or Go Out",
  [GAMESTATUS.PENDING_DRAW]: "Draw from Discard or Deck",
  [GAMESTATUS.PENDING_NEXT_ROUND]: "The Round is Over",
  [GAMESTATUS.PENDING_OPPONENT_OUT]: "Waiting for $ to Go Out",
};

const NEXT_ROUND_STATUS = {
  NONE: "NONE",
  PROMPT: "PROMPT",
  WAIT: "WAIT",
};

const Status = ({ game, status, goingOutStatus, onStartNextRound }) => {
  //console.log(game, status, goingOutStatus);

  const bgColor =
    status === GAMESTATUS.PENDING_TURN
      ? "bg-pink-300"
      : status === GAMESTATUS.PENDING_OPPONENT_OUT
      ? "bg-blue-300"
      : "bg-green-300";

  let nextRoundStatus = NEXT_ROUND_STATUS.NONE;
  if (game.roundStatus === "AwaitingNextRound") {
    if (goingOutStatus.readyForNextRound) {
      nextRoundStatus = NEXT_ROUND_STATUS.WAIT;
    } else {
      nextRoundStatus = NEXT_ROUND_STATUS.PROMPT;
    }
  }

  return (
    <>
      {game.roundStatus === "MustGoOut" &&
        goingOutStatus.status === GOINGOUTSTATUS.NONE && (
          <div className={`text-center p-4 w-full bg-red-500`}>
            The round is ending. You must go out.
          </div>
        )}
      <div className={`text-center p-4 w-full ${bgColor}`}>
        {messages[status].replace("$", game.whoseTurn)}
      </div>

      {nextRoundStatus === NEXT_ROUND_STATUS.PROMPT ? (
        <div className="w-full mx-auto mt-4">
          <button
            className="p-4 text-center text-black bg-green-300 rounded"
            onClick={onStartNextRound}
          >
            Ready for Next Round
          </button>
        </div>
      ) : nextRoundStatus === NEXT_ROUND_STATUS.WAIT ? (
        <div className="w-full mx-auto mt-4">
          <button
            className="p-4 text-center text-black bg-red-300 rounded"
            disabled
          >
            Waiting for Next Round
          </button>
        </div>
      ) : null}
    </>
  );
};

export default Status;

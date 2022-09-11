/*
click to draw
pre/post drops for discard
hand drop zone goes away if all cards are in words
pre/post drops not working when dragging between words (or from hand to 2nd word?)
*/

import { DndContext, DragOverlay, rectIntersection } from "@dnd-kit/core";
import _ from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { checkWords, loadGame, makeMove, sortHand } from "../api";
import { GAMESTATUS, GOINGOUTSTATUS, MOVETYPES } from "../const";
import { DragOverlayCard } from "./Card";
import Deck from "./Deck";
import Hand from "./Hand";
import MakeWords from "./MakeWords";
import Scores from "./Scores";
import Status from "./Status";
import Words from "./Words";

const swapArrayElements = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const findWithPrePost = (list, keyField, dest) => {
  switch (dest) {
    case "pre":
      return 0;
    case "post":
      return list.length;
    default:
      return list.findIndex((x) => x[keyField] === dest);
  }
};

const Game = ({ auth }) => {
  const { gameId } = useParams();

  const [game, setGame] = useState();
  const [hand, setHand] = useState();
  const [goingOut, setGoingOut] = useState({ status: GOINGOUTSTATUS.NONE });
  const [draggingId, setDraggingId] = useState();

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    import.meta.env.VITE_WEB_SOCKET_URL
  );

  useEffect(() => {
    if (readyState == ReadyState.OPEN) {
      sendJsonMessage({ action: "connect", channel: gameId });
    }
  }, [readyState]);

  useEffect(() => {
    if (lastMessage?.data == "Update Available") {
      loadGame(gameId).then((res) => setState(res));
    }
  }, [lastMessage]);

  useEffect(() => {
    loadGame(gameId).then((res) => setState(res));
  }, [gameId]);

  const gameStatus = useMemo(() => {
    if (!game) return;

    if (game.roundStatus === "GameOver") return GAMESTATUS.GAME_OVER;
    if (game.roundStatus === "AwaitingNextRound") return GAMESTATUS.PENDING_NEXT_ROUND;
    if (goingOut.status === GOINGOUTSTATUS.GONE) return GAMESTATUS.PENDING_OPPONENT_OUT;
    if (game.whoseTurn !== auth.name) return GAMESTATUS.PENDING_TURN;
    if (hand.length > game.cardsInRound) return GAMESTATUS.PENDING_DISCARD;

    return GAMESTATUS.PENDING_DRAW;
  }, [game, goingOut, hand, auth]);

  const setState = (game) => {
    const me = game.players.find((p) => p.name === auth.name);

    setGoingOut({
      status: me.hasGoneOut ? GOINGOUTSTATUS.GONE : GOINGOUTSTATUS.NONE,
      hand: [],
      words: me.words,
      readyForNextRound: me.readyForNextRound,
    });
    setHand(me.hand);
    setGame(game);
  };

  const handleDrawCard = (moveType) => {
    if (gameStatus === GAMESTATUS.PENDING_DRAW) {
      makeMove(gameId, moveType).then((res) => setState(res));
    }
  };

  const handleDiscard = async (card) => {
    if (gameStatus === GAMESTATUS.PENDING_DISCARD) {
      if (goingOut.status === GOINGOUTSTATUS.GOING) {
        if (goingOut.hand.length !== 1 && game.roundStatus !== "MustGoOut") {
          alert("You must use all the letters in your hand");
          return;
        }

        var wordStrings = goingOut.words.map((word) => word.map((c) => c.letter).join(""));

        var checkedWords = await checkWords(wordStrings);

        if (checkedWords.invalidWords?.length > 0) {
          alert("Some words are invalid:\n" + checkedWords.invalidWords.join("\n"));
          return;
        }

        makeMove(gameId, MOVETYPES.GO_OUT, {
          cardToDiscard: card,
          words: goingOut.words,
        }).then((res) => {
          setGoingOut({ ...goingOut, status: GOINGOUTSTATUS.GONE });
          setState(res);
        });
      } else {
        if (game.roundStatus === "MustGoOut") {
          alert("You must go out");
          return;
        }
        makeMove(gameId, MOVETYPES.DISCARD, { cardToDiscard: card }).then((res) => setState(res));
      }
    }
  };

  const handleSortHand = (src, dest) => {
    const srcIdx = hand.findIndex((c) => c.cardId === src);
    const destIdx = findWithPrePost(hand, "cardId", dest);

    const newHand = swapArrayElements(hand, srcIdx, destIdx);

    setHand(newHand); // update UI immediately
    sortHand(gameId, newHand).then((res) => setState(res));
  };

  const handleMakeWord = (cardId, dest, srcRow, destRow) => {
    //console.log("makeWord", cardId, dest, srcRow, destRow);

    let newHand = _.cloneDeep(goingOut.hand);
    let newWords = _.cloneDeep(goingOut.words);
    let card;

    if (srcRow === "hand") {
      card = _.remove(newHand, (c) => c.cardId === cardId);
    }
    if (srcRow.startsWith("word")) {
      const i = parseInt(srcRow.substring(5));
      card = _.remove(newWords[i], (c) => c.cardId === cardId);
    }

    // "card" is now a one-element array of the card that was dropped, so the card object itself is card[0]

    if (destRow === "hand") {
      const pos = newHand.findIndex((c) => c.cardId === dest);
      newHand.splice(pos, 0, card[0]);
    }
    if (destRow.startsWith("word")) {
      if (destRow === "word-new") {
        newWords.push(card);
      } else {
        const wordNum = parseInt(destRow.substring(5));
        const pos = findWithPrePost(newWords[wordNum], "cardId", dest);
        newWords[wordNum].splice(pos, 0, card[0]);
      }
    }

    setGoingOut({
      status: GOINGOUTSTATUS.GOING,
      hand: newHand,
      words: newWords.filter((w) => w.length > 0),
    });
  };

  const handleStartToGoOut = () => {
    setGoingOut({ status: GOINGOUTSTATUS.GOING, hand, words: [] });
  };

  const handleStartNextRound = () => {
    makeMove(gameId, MOVETYPES.READY_FOR_NEXT_ROUND).then((res) => setState(res));
  };

  const handleDragStart = (event) => {
    setDraggingId(event.active.id);
  };

  const handleDragEnd = (result) => {
    setDraggingId(null);

    const { active, over } = result;

    if (!active || !over) {
      return;
    }

    const src = active.id;
    const dest = over.id;
    const srcRow = active.data?.current?.src;
    const destRow = over.data?.current?.src;

    //console.log("handleDragEnd", src, srcRow, dest, destRow);

    if (srcRow === "deck" && destRow === "hand") {
      if (src === "shoe") {
        handleDrawCard(MOVETYPES.DRAW_FROM_DECK);
      } else {
        handleDrawCard(MOVETYPES.DRAW_FROM_DISCARD);
      }
    }

    if (srcRow === "hand" && destRow === "deck") {
      handleDiscard(active.id);
    }

    if (srcRow === "hand" && destRow === "hand" && src !== dest) {
      handleSortHand(src, dest);
    }

    if (destRow.startsWith("word")) {
      handleMakeWord(src, dest, srcRow, destRow);
    }

    if (srcRow.startsWith("word")) {
      if (destRow === "hand") {
        handleMakeWord(src, dest, srcRow, destRow);
      }
      if (destRow === "deck") {
        handleDiscard(src);
      }
    }
  };

  if (!game) return null;

  return (
    <div className="flex flex-col items-start justify-center w-full">
      <Scores players={game.players} />
      <Words players={game.players} />
      <Status
        game={game}
        status={gameStatus}
        goingOutStatus={goingOut}
        onStartNextRound={handleStartNextRound}
      />
      {gameStatus !== GAMESTATUS.PENDING_NEXT_ROUND && gameStatus !== GAMESTATUS.GAME_OVER && (
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={rectIntersection}
        >
          <Deck discardPile={game.topOfDiscardPile} gameStatus={gameStatus} />
          <Hand
            hand={goingOut.status === GOINGOUTSTATUS.NONE ? hand : goingOut.hand}
            gameStatus={gameStatus}
          />
          {goingOut.status === GOINGOUTSTATUS.GOING && <MakeWords words={goingOut.words} />}
          <DragOverlay>
            {draggingId ? (
              <DragOverlayCard id={draggingId} showBack={draggingId === "shoe"} />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
      {gameStatus === GAMESTATUS.PENDING_DISCARD && goingOut.status === GOINGOUTSTATUS.NONE && (
        <div
          className="absolute p-4 text-xl text-white bg-blue-700 rounded-full cursor-pointer bottom-2 right-2"
          onClick={handleStartToGoOut}
        >
          Go Out
        </div>
      )}
      {gameStatus === GAMESTATUS.PENDING_DISCARD && goingOut.status === GOINGOUTSTATUS.NONE && (
        <div
          className="absolute p-4 text-xl text-white bg-blue-700 rounded-full cursor-pointer bottom-2 right-2"
          onClick={handleStartToGoOut}
        >
          Go Out
        </div>
      )}
    </div>
  );
};

export default Game;

import { Fab, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { loadGame, makeMove, sortHand } from "../api";
import { GAMESTATUS, MOVETYPES } from "../const";
import Deck from "./Deck";
import Hand from "./Hand";
import Scores from "./Scores";
import Status from "./Status";
import Words from "./Words";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    justify: "center",
    alignItems: "flex-start"
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  }
}));

const eventUrl = process.env.REACT_APP_API_BASE_URL.replace("api", "sse");

const swapArrayElements = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const Game = ({ match, auth }) => {
  const classes = useStyles();

  let [game, setGame] = useState();
  let [hand, setHand] = useState();
  let [goingOut, setGoingOut] = useState(false);
  let [words, setWords] = useState();

  let eventSource = useRef();

  const gameId = match.params.id;

  useEffect(
    () => {
      const asyncEffect = async () => {
        loadGame(gameId).then(res => {
          setState(res);
        });
      };

      asyncEffect();
      eventSource.current = new EventSource(eventUrl);
      eventSource.current.onmessage = handleEvent;
    },
    // eslint-disable-next-line
    [gameId]
  );

  const gameStatus = useMemo(() => {
    if (!game) return;

    if (game.whoseTurn !== auth.name) {
      return GAMESTATUS.PENDING_TURN;
    } else {
      if (hand.length > game.cardsInRound) {
        return GAMESTATUS.PENDING_DISCARD;
      } else {
        return GAMESTATUS.PENDING_DRAW;
      }
    }
  }, [game, hand, auth]);

  const setState = game => {
    setHand(game.players.find(p => p.name === auth.name).hand);
    setGame(game);
  };

  const handleEvent = e => {
    if (e.data === gameId) {
      loadGame(gameId).then(res => setState(res));
    }
  };

  const handleDrawFromDiscard = () => {
    if (gameStatus === GAMESTATUS.PENDING_DRAW) {
      makeMove(gameId, MOVETYPES.DRAW_FROM_DISCARD).then(res => setState(res));
    }
  };

  const handleDrawFromDeck = () => {
    if (gameStatus === GAMESTATUS.PENDING_DRAW) {
      makeMove(gameId, MOVETYPES.DRAW_FROM_DECK).then(res => setState(res));
    }
  };

  const handleDiscard = card => {
    if (gameStatus === GAMESTATUS.PENDING_DISCARD) {
      if (goingOut) {
        // TODO: if going out, check words, and if words are valid
        //makeMove(MOVETYPES.GO_OUT, { words.words, card });
      } else {
        makeMove(gameId, MOVETYPES.DISCARD, { card }).then(res => setState(res));
      }
    }
  };

  const handleSortHand = (src, dst) => {
    const newHand = swapArrayElements(hand, src, dst);

    // set local state so UI is immediately updated
    setHand(newHand);

    // save new hand to server and get it back to re-render properly
    sortHand(gameId, newHand).then(res => setState(res));
  };

  const handleMakeWord = (cardId, source, destination) => {
    let newHand = _.cloneDeep(words.hand);
    let newWords = _.cloneDeep(words.words);
    let card;

    if (source.droppableId === "hand") {
      card = _.remove(newHand, c => c.cardId === cardId);
    }
    if (source.droppableId.startsWith("word")) {
      const i = parseInt(source.droppableId.substring(5));
      card = _.remove(newWords[i], c => c.cardId === cardId);
    }

    // "card" is now a one-element array of the card that was dropped, so the card object itself is card[0]

    if (destination.droppableId === "hand") {
      newHand.splice(destination.index, 0, card[0]);
    }
    if (destination.droppableId.startsWith("word")) {
      if (destination.droppableId === "word-new") {
        newWords.push(card);
      } else {
        const i = parseInt(destination.droppableId.substring(5));
        newWords[i].splice(destination.index, 0, card[0]);
      }
    }

    setWords({
      hand: newHand,
      words: newWords
    });
  };

  const handleStartToGoOut = () => {
    setGoingOut(true);
    setWords({
      hand,
      words: [
        /* sample seed data for testing
        [
          { cardId: "A-99", letter: "A", value: 0 },
          { cardId: "B-99", letter: "B", value: 0 }
        ],
        [
          { cardId: "C-99", letter: "C", value: 0 },
          { cardId: "D-99", letter: "D", value: 0 }
        ]
        */
      ]
    });
  };

  const handleDragEnd = result => {
    if (!result.destination) {
      return;
    }

    if (result.draggableId === "shoe" && result.destination.droppableId === "hand") {
      handleDrawFromDeck();
    }

    if (
      result.draggableId === "discard" &&
      result.destination.droppableId === "hand"
    ) {
      handleDrawFromDiscard();
    }

    if (
      result.source.droppableId === "hand" &&
      result.destination.droppableId === "deck"
    ) {
      handleDiscard(result.draggableId);
    }

    if (
      result.source.droppableId === "hand" &&
      result.destination.droppableId === "hand"
    ) {
      handleSortHand(result.source.index, result.destination.index);
    }

    if (result.destination.droppableId.startsWith("word")) {
      handleMakeWord(result.draggableId, result.source, result.destination);
    }
  };

  if (!game) return null;

  return (
    <Grid className={classes.root} container spacing={0}>
      <Scores players={game.players} />
      <Status game={game} status={gameStatus} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Deck discardPile={game.topOfDiscardPile} gameStatus={gameStatus} />
        <Hand hand={goingOut ? words.hand : hand} gameStatus={gameStatus} />
        {gameStatus === GAMESTATUS.PENDING_DISCARD && !goingOut && (
          <Fab
            variant="extended"
            color="primary"
            className={classes.fab}
            onClick={handleStartToGoOut}
          >
            Go Out
          </Fab>
        )}
        {goingOut && <Words words={words.words} />}
      </DragDropContext>
    </Grid>
  );
};

export default Game;

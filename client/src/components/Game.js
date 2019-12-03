import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useRef, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { connect } from "react-redux";
import { GAMESTATUS, MOVETYPES } from "../const";
import { loadGame, makeMove, sortHand } from "../ducks/gameDuck";
import Deck from "./Deck";
import Hand from "./Hand";
import Scores from "./Scores";
import Status from "./Status";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    justify: "center",
    alignItems: "flex-start"
  }
}));

const eventUrl = process.env.REACT_APP_API_BASE_URL.replace("api", "sse");

const Game = ({ match, myName, game, loadGame, makeMove, sortHand }) => {
  const classes = useStyles();

  let [gameStatus, setGameStatus] = useState();
  let [hand, setHand] = useState();

  let eventSource = useRef();

  const gameId = match.params.id;

  useEffect(
    () => {
      loadGame(gameId);
      eventSource.current = new EventSource(eventUrl);
      eventSource.current.onmessage = handleEvent;
    },
    // eslint-disable-next-line
    [gameId]
  );

  useEffect(() => {
    if (game && game.players) {
      setHand(game.players.find(p => p.name === myName).hand);
    }
  }, [game, myName]);

  useEffect(() => {
    if (game.whoseTurn !== myName) {
      setGameStatus(GAMESTATUS.PENDING_TURN);
    } else {
      if (hand && hand.length > game.cardsInRound) {
        setGameStatus(GAMESTATUS.PENDING_DISCARD);
      } else {
        setGameStatus(GAMESTATUS.PENDING_DRAW);
      }
    }
  }, [game, hand, myName]);

  const handleEvent = e => {
    if (e.data === gameId) {
      loadGame(gameId);
    }
  };

  const handleDrawFromDiscard = () => {
    if (gameStatus === GAMESTATUS.PENDING_DRAW) {
      makeMove(MOVETYPES.DRAW_FROM_DISCARD);
    }
  };

  const handleDrawFromDeck = () => {
    if (gameStatus === GAMESTATUS.PENDING_DRAW) {
      makeMove(MOVETYPES.DRAW_FROM_DECK);
    }
  };

  const handleDiscard = cardToDiscard => {
    if (gameStatus === GAMESTATUS.PENDING_DISCARD) {
      makeMove(MOVETYPES.DISCARD, { cardToDiscard });
    }
  };

  const handleSortHand = (src, dst) => {
    const newHand = reorder(hand, src, dst);
    setHand(newHand); // locally
    sortHand(newHand); // on server
  };

  /*
  const handleGoOut = (words, cardToDiscard) => {
    if (gameStatus === GAMESTATUS.PENDING_DISCARD) {
      makeMove(MOVETYPES.GO_OUT, { words, cardToDiscard });
    } else {
      alert("Not time to discard");
    }
  };
  */

  const handleDragEnd = result => {
    if (!result.destination) {
      return;
    }

    if (
      result.draggableId === "shoe" &&
      result.destination.droppableId === "hand"
    ) {
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
  };

  if (!(game && game.players && gameStatus && hand)) return null;

  return (
    <Grid className={classes.root} container spacing={0}>
      <Scores players={game.players} />
      <Status game={game} status={gameStatus} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Deck discardPile={game.topOfDiscardPile} gameStatus={gameStatus} />
        <Hand hand={hand} gameStatus={gameStatus} />
      </DragDropContext>
    </Grid>
  );
};

const mapStateToProps = state => {
  return {
    myName: state.auth.name,
    game: state.game.game
  };
};

const mapDispatchToProps = {
  loadGame,
  makeMove,
  sortHand
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);

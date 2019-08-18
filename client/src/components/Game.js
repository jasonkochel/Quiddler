import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { GAMESTATUS, MOVETYPES } from "../const";
import { loadGame, makeMove } from "../ducks/gameDuck";
import Deck from "./Deck";
import Hand from "./Hand";
import Scores from "./Scores";
import Status from "./Status";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    width: "100%",
    maxWidth: 360,
    justify: "center",
    alignItems: "flex-start"
  }
}));

const Game = ({ match, myName, game, load, move }) => {
  const classes = useStyles();

  let [gameStatus, setGameStatus] = useState();

  useEffect(() => {
    load(match.params.id);
  }, [load, match]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (false && gameStatus === GAMESTATUS.PENDING_TURN)
        load(match.params.id);
    }, 1000);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    if (game.whoseTurn !== myName) {
      setGameStatus(GAMESTATUS.PENDING_TURN);
    } else {
      const cardsInHand = game.players.find(p => p.name === myName).hand.length;
      if (cardsInHand > game.cardsInRound) {
        setGameStatus(GAMESTATUS.PENDING_DISCARD);
      } else {
        setGameStatus(GAMESTATUS.PENDING_DRAW);
      }
    }
  }, [game, myName]);

  const handleDrawFromDiscard = () => {
    if (gameStatus === GAMESTATUS.PENDING_DRAW) {
      move(MOVETYPES.DRAW_FROM_DISCARD);
    } else {
      alert("Not time to draw");
    }
  };

  const handleDrawFromDeck = () => {
    if (gameStatus === GAMESTATUS.PENDING_DRAW) {
      move(MOVETYPES.DRAW_FROM_DECK);
    } else {
      alert("Not time to draw");
    }
  };

  const handleDiscard = cardToDiscard => {
    if (gameStatus === GAMESTATUS.PENDING_DISCARD) {
      move(MOVETYPES.DISCARD, { cardToDiscard });
    } else {
      alert("Not time to discard");
    }
  };

  const handleGoOut = (words, cardToDiscard) => {
    if (gameStatus === GAMESTATUS.PENDING_DISCARD) {
      move(MOVETYPES.GO_OUT, { words, cardToDiscard });
    } else {
      alert("Not time to discard");
    }
  };

  if (!(game && game.players)) return null;

  return (
    <Grid className={classes.root} container spacing={0}>
      <Scores players={game.players} />
      <Status game={game} status={gameStatus} />
      <Deck
        discardPile={game.topOfDiscardPile}
        onDrawFromDiscard={handleDrawFromDiscard}
        onDrawFromDeck={handleDrawFromDeck}
      />
      <Hand
        hand={game.players.find(p => p.name === myName).hand}
        onDiscard={handleDiscard}
        onGoOut={handleGoOut}
      />
    </Grid>
  );
};

const mapStateToProps = state => {
  return {
    myName: state.auth.name,
    game: state.game.game
  };
};

const mapDispatchToProps = dispatch => {
  return {
    load: id => dispatch(loadGame(id)),
    move: (moveType, moveData) => dispatch(makeMove(moveType, moveData))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);

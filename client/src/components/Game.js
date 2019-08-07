import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadGame, makeMove } from "../ducks/gameDuck";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}));

const Game = ({ match, game, load, move }) => {
  const classes = useStyles();

  useEffect(() => {
    const loadWrapped = async () => await load(match.params.id);
    loadWrapped();
  }, [load, match]);

  return (
    <div className={classes.root}>
      <pre>{JSON.stringify(game)}</pre>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    game: state.game.game
  };
};

const mapDispatchToProps = dispatch => {
  return {
    load: id => dispatch(loadGame(id)),
    move: () => dispatch(makeMove())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);

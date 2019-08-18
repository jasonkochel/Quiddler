import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { createGame, joinGame, loadList } from "../ducks/gameDuck";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}));

const GameList = ({ history, myName, games, getAll, create, join }) => {
  const classes = useStyles();

  useEffect(() => {
    getAll();
  }, [getAll]);

  const handleJoinGame = id => join(id).then(() => handlePlayGame(id));
  const handlePlayGame = id => history.push(`/games/${id}`);

  return (
    <div className={classes.root}>
      <List
        component="nav"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            Games
          </ListSubheader>
        }
      >
        {games.map(g => (
          <ListItem key={g.gameId}>
            <ListItemText
              primary={g.players.join(", ")}
              secondary={g.hasStarted ? null : "Not Started"}
            />
            <ListItemSecondaryAction>
              {g.players.includes(myName) ? (
                <Button onClick={() => handlePlayGame(g.gameId)}>Play</Button>
              ) : (
                <Button onClick={() => handleJoinGame(g.gameId)}>Join</Button>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button onClick={create}>New Game</Button>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    myName: state.auth.name,
    games: state.game.gameList
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAll: () => dispatch(loadList()),
    create: () => dispatch(createGame()),
    join: id => dispatch(joinGame(id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameList);

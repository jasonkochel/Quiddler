import {
  Button,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createGame, joinGame, loadList } from "../api";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const GameList = ({ auth }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [games, setGames] = useState();

  useEffect(() => {
    const asyncEffect = async () => {
      setGames(await loadList());
    };

    asyncEffect();
  }, []);

  const handlePlayGame = (id) => navigate(`/games/${id}`);

  const handleJoinGame = (id) => joinGame(id).then(() => handlePlayGame(id));

  const handleCreateGame = () =>
    createGame()
      .then(() => loadList())
      .then((res) => setGames(res));

  if (!games) return null;

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
        {games.map((g) => (
          <ListItem key={g.gameId}>
            <ListItemText
              primary={g.players.join(", ")}
              secondary={g.hasStarted ? null : "Not Started"}
            />
            <ListItemSecondaryAction>
              {g.players.includes(auth.name) ? (
                <Button onClick={() => handlePlayGame(g.gameId)}>Play</Button>
              ) : (
                <Button onClick={() => handleJoinGame(g.gameId)}>Join</Button>
              )}
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
      <Button onClick={handleCreateGame}>New Game</Button>
    </div>
  );
};

export default GameList;

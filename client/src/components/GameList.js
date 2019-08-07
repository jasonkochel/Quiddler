import { Button } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { createGame, joinGame, loadList } from "../ducks/gameDuck";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}));

function ListItemLink(props) {
  return <ListItem button component={Link} {...props} />;
}

const GameList = ({ games, getAll, create, join }) => {
  const classes = useStyles();

  useEffect(() => {
    const getAllWrapped = async () => await getAll();
    getAllWrapped();
  }, [getAll]);

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
          <ListItemLink key={g.gameId} to={`/games/${g.gameId}`}>
            <ListItemText
              primary={g.players}
              secondary={g.hasStarted ? null : "Not Started"}
            />
          </ListItemLink>
        ))}
      </List>
      <Button onClick={create}>Create</Button>
    </div>
  );
};

const mapStateToProps = state => {
  return {
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

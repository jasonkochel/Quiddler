import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { GAMESTATUS } from "../const";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center"
  },
  yourMove: {
    backgroundColor: "lightgreen"
  },
  theirMove: {
    backgroundColor: "pink"
  }
}));

const messages = {
  [GAMESTATUS.PENDING_TURN]: "Waiting for $ to Play",
  [GAMESTATUS.PENDING_DISCARD]: "Discard or Go Out",
  [GAMESTATUS.PENDING_DRAW]: "Draw from Discard or Deck"
};

const Scores = ({ game, status }) => {
  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Paper
        className={`${classes.paper} ${
          status === GAMESTATUS.PENDING_TURN
            ? classes.theirMove
            : classes.yourMove
        }`}
      >
        {messages[status].replace("$", game.whoseTurn)}
      </Paper>
    </Grid>
  );
};

export default Scores;

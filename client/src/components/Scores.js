import { Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    backgroundColor: "black",
    color: "white"
  }
}));

const Scores = ({ players }) => {
  const classes = useStyles();

  const width = 12 / players.length;

  return players.map(p => (
    <Grid item xs={width}>
      <Paper square className={classes.paper}>
        {p.name}
        <br />
        {p.score}
      </Paper>
    </Grid>
  ));
};

export default Scores;

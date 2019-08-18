import { Card, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(theme => ({
  card: {
    width: 75,
    height: 120,
    fontSize: "36px",
    lineHeight: "120px",
    textAlign: "center",
    display: "inline-block",
    cursor: "pointer"
  }
}));

const Hand = ({ hand, onDiscard }) => {
  const classes = useStyles();

  return hand.map(c => (
    <Grid item xs={3}>
      <Card className={classes.card} onClick={() => onDiscard(c)}>
        {c}
      </Card>
    </Grid>
  ));
};

export default Hand;

import { Card, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import cardback from "./../card-back.jpg";

const useStyles = makeStyles(theme => ({
  gridItem: {
    textAlign: "center"
  },
  card: {
    width: 75,
    height: 120,
    fontSize: "36px",
    lineHeight: "120px",
    textAlign: "center",
    display: "inline-block",
    cursor: "pointer"
  },
  deck: {
    backgroundImage: `url(${cardback})`,
    backgroundSize: "contain",
    color: "yellow",
    fontStyle: "italic"
  }
}));

const Deck = ({ discardPile, onDrawFromDiscard, onDrawFromDeck }) => {
  const classes = useStyles();

  return (
    <>
      <Grid item xs={6} className={classes.gridItem}>
        <Card className={classes.card} onClick={onDrawFromDiscard}>
          {discardPile}
        </Card>
      </Grid>
      <Grid item xs={6} className={classes.gridItem}>
        <Card
          className={`${classes.card} ${classes.deck}`}
          onClick={onDrawFromDeck}
        />
      </Grid>
    </>
  );
};

export default Deck;

import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { GAMESTATUS } from "../const";
import cardback from "./../card-back.jpg";

const useStyles = makeStyles(theme => ({
  gridItem: {
    textAlign: "center"
  },
  card: {
    width: 75,
    height: 120,
    margin: "8px",
    display: "inline-block",
    cursor: "pointer"
  },
  cardLetter: {
    fontSize: "36px",
    lineHeight: "75px",
    textAlign: "center"
  },
  deck: {
    backgroundImage: `url(${cardback})`,
    backgroundSize: "contain",
    color: "yellow",
    fontStyle: "italic"
  }
}));

const Deck = ({ discardPile, gameStatus }) => {
  const classes = useStyles();

  return (
    <Droppable
      droppableId="deck"
      direction="horizontal"
      isDropDisabled={gameStatus !== GAMESTATUS.PENDING_DISCARD}
    >
      {provided => (
        <Grid
          item
          xs={12}
          className={classes.gridItem}
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          <Draggable
            draggableId="discard"
            index={0}
            isDragDisabled={gameStatus !== GAMESTATUS.PENDING_DRAW}
          >
            {provided => (
              <Card
                className={classes.card}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                <CardContent>
                  <div className={classes.cardLetter}>{discardPile.letter}</div>
                  <Typography color="textSecondary">
                    {discardPile.value}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Draggable>
          <Draggable
            draggableId="shoe"
            index={1}
            isDragDisabled={gameStatus !== GAMESTATUS.PENDING_DRAW}
          >
            {provided => (
              <Card
                className={`${classes.card} ${classes.deck}`}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              />
            )}
          </Draggable>
          {provided.placeholder}
        </Grid>
      )}
    </Droppable>
  );
};

export default Deck;

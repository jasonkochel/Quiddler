import { Card, CardContent, Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

const useStyles = makeStyles(theme => ({
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
  }
}));

const Hand = ({ hand }) => {
  const classes = useStyles();

  return (
    <Droppable droppableId="hand" direction="horizontal">
      {provided => (
        <Grid item xs={12} ref={provided.innerRef} {...provided.droppableProps}>
          {hand.map((c, i) => (
            <Draggable key={c.cardId} draggableId={c.cardId} index={i}>
              {provided => (
                <Card
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={classes.card}
                >
                  <CardContent>
                    <div className={classes.cardLetter}>{c.letter}</div>
                    <Typography color="textSecondary">{c.value}</Typography>
                  </CardContent>
                </Card>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </Grid>
      )}
    </Droppable>
  );
};

export default Hand;

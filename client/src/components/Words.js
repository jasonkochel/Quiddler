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
  },
  dropzone: {
    background: "white",
    borderRadius: "15px",
    border: "2px dashed rgb(0, 135, 247)",
    height: "120px",
    lineHeight: "120px",
    width: "500px",
    marginLeft: "auto",
    marginRight: "auto"
  }
}));

const Words = ({ words }) => {
  const classes = useStyles();

  if (!words) return null;

  return (
    <>
      {words.map((word, wordIdx) => (
        <Droppable
          key={wordIdx}
          droppableId={`word-${wordIdx}`}
          direction="horizontal"
        >
          {provided => (
            <Grid
              item
              xs={12}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {word.map((card, cardIdx) => (
                <Draggable
                  key={card.cardId}
                  draggableId={card.cardId}
                  index={cardIdx}
                >
                  {provided => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={classes.card}
                    >
                      <CardContent>
                        <div className={classes.cardLetter}>{card.letter}</div>
                        <Typography color="textSecondary">
                          {card.value}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      ))}
      <Droppable droppableId="word-new">
        {provided => (
          <>
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={classes.dropzone}
            >
              Drop cards here to make a word
            </div>
            {provided.placeholder}{" "}
          </>
        )}
      </Droppable>
    </>
  );
};

export default Words;

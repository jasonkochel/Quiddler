import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Card from "./Card";

const Hand = ({ hand }) => {
  return (
    <Droppable droppableId="hand" direction="horizontal">
      {(provided) => (
        <div
          className="flex flex-row flex-wrap justify-center w-full"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {hand.map((c, i) => (
            <Draggable key={c.cardId} draggableId={c.cardId} index={i}>
              {(provided) => (
                <Card
                  letter={c.letter}
                  value={c.value}
                  innerRef={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                />
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default Hand;

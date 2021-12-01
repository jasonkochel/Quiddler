import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { GAMESTATUS } from "../const";
import Card from "./Card";

const Deck = ({ discardPile, gameStatus }) => (
  <Droppable
    droppableId="deck"
    direction="horizontal"
    isDropDisabled={gameStatus !== GAMESTATUS.PENDING_DISCARD}
  >
    {(provided) => (
      <div
        className="flex flex-row justify-center w-full"
        ref={provided.innerRef}
        {...provided.droppableProps}
      >
        {discardPile && (
          <Draggable
            draggableId="discard"
            index={0}
            isDragDisabled={gameStatus !== GAMESTATUS.PENDING_DRAW}
          >
            {(provided) => (
              <Card
                letter={discardPile.letter}
                value={discardPile.value}
                innerRef={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              />
            )}
          </Draggable>
        )}
        <Draggable
          draggableId="shoe"
          index={1}
          isDragDisabled={gameStatus !== GAMESTATUS.PENDING_DRAW}
        >
          {(provided) => (
            <Card
              showBack
              innerRef={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            />
          )}
        </Draggable>
        {provided.placeholder}
      </div>
    )}
  </Droppable>
);

export default Deck;

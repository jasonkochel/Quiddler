import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Card from "./Card";

const MakeWords = ({ words }) => {
  if (!words) return null;

  return (
    <div className="flex flex-col w-full">
      {words.map((word, wordIdx) => (
        <Droppable key={wordIdx} droppableId={`word-${wordIdx}`} direction="horizontal">
          {(provided) => (
            <>
              <div>Word {wordIdx + 1}</div>
              <div
                className="flex flex-row flex-wrap justify-center w-full"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {word.map((card, cardIdx) => (
                  <Draggable key={card.cardId} draggableId={card.cardId} index={cardIdx}>
                    {(provided) => (
                      <Card
                        letter={card.letter}
                        value={card.value}
                        innerRef={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </>
          )}
        </Droppable>
      ))}
      <Droppable droppableId="word-new">
        {(provided) => (
          <>
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="w-11/12 h-24 leading-[6rem] mx-auto bg-white border-2 border-blue-500 border-dashed rounded-2xl "
            >
              Drop cards here to make a new word
            </div>
            {provided.placeholder}
          </>
        )}
      </Droppable>
    </div>
  );
};

export default MakeWords;

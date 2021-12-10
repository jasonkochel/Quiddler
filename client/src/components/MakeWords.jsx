import { useDroppable } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import React from "react";
import Card from "./Card";

const MakeWord = ({ word, wordIdx }) => {
  const { setNodeRef: setNodeRefPre } = useDroppable({
    id: "pre",
    data: { src: "word-" + wordIdx },
  });
  const { setNodeRef: setNodeRefPost } = useDroppable({
    id: "post",
    data: { src: "word-" + wordIdx },
  });

  return (
    <>
      <div>Word {wordIdx + 1}</div>
      <div className="flex flex-row justify-center w-full">
        <div
          className="flex-grow border border-white border-dashed rounded"
          ref={setNodeRefPre}
        ></div>
        <SortableContext
          id={`word-${wordIdx}`}
          items={word.map((card) => card.cardId)}
          strategy={horizontalListSortingStrategy}
        >
          {word.map((card) => (
            <Card
              key={card.cardId}
              id={card.cardId}
              value={card.value}
              dndData={{ src: "word-" + wordIdx }}
            />
          ))}
        </SortableContext>
        <div
          className="flex-grow border border-white border-dashed rounded"
          ref={setNodeRefPost}
        ></div>
      </div>
    </>
  );
};

const MakeWords = ({ words }) => {
  const { setNodeRef } = useDroppable({
    id: "word-new",
    data: { src: "word-new" },
  });

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col justify-center w-full">
        {words.map((word, wordIdx) => (
          <MakeWord key={wordIdx} word={word} wordIdx={wordIdx} />
        ))}
      </div>
      <div
        className="w-11/12 h-24 leading-[6rem] mx-auto bg-white border-2 border-blue-500 border-dashed rounded-2xl"
        ref={setNodeRef}
      >
        Drop cards here to make a new word
      </div>
    </div>
  );
};

/*
const OldMakeWords = ({ words }) => {
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
*/

export default MakeWords;

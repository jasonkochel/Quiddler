import { useDroppable } from "@dnd-kit/core";
import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import React from "react";
import Card from "./Card";

const Hand = ({ hand }) => {
  const { setNodeRef: setNodeRefPre } = useDroppable({
    id: "pre",
    data: { src: "hand" },
  });
  const { setNodeRef: setNodeRefPost } = useDroppable({
    id: "post",
    data: { src: "hand" },
  });

  return (
    <div className="flex flex-row flex-wrap justify-center w-full">
      <SortableContext
        id="hand"
        items={hand.map((c) => c.cardId)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex-grow" ref={setNodeRefPre}></div>
        {hand.map((c, i) => (
          <Card key={c.cardId} id={c.cardId} value={c.value} dndData={{ src: "hand" }} />
        ))}
        <div className="flex-grow" ref={setNodeRefPost}></div>
      </SortableContext>
    </div>
  );
};

export default Hand;

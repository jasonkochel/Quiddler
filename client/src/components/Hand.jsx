import { horizontalListSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import React from "react";
import Card from "./Card";

const Hand = ({ hand }) => {
  return (
    <div className="flex flex-row flex-wrap justify-center w-full">
      <SortableContext
        id="hand"
        items={hand.map((c) => c.cardId)}
        strategy={horizontalListSortingStrategy}
      >
        {hand.map((c, i) => (
          <Card key={c.cardId} id={c.cardId} value={c.value} dndData={{ src: "hand" }} />
        ))}
      </SortableContext>
    </div>
  );
};

export default Hand;

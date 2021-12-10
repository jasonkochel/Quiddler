import { useDroppable } from "@dnd-kit/core";
import React from "react";
import { GAMESTATUS } from "../const";
import Card from "./Card";

const Deck = ({ discardPile, gameStatus }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: "deck",
    disabled: gameStatus !== GAMESTATUS.PENDING_DISCARD,
  });

  return (
    <div className="flex flex-row justify-center w-full" ref={setNodeRef}>
      {discardPile && (
        <Card
          id={discardPile.cardId}
          value={discardPile.value}
          dndDisabled={gameStatus !== GAMESTATUS.PENDING_DRAW}
          dndData={{ src: "deck" }}
        />
      )}
      <Card
        showBack
        id="shoe"
        dndDisabled={gameStatus !== GAMESTATUS.PENDING_DRAW}
        dndData={{ src: "deck" }}
      />
    </div>
  );
};

export default Deck;

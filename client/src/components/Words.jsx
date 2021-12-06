import React from "react";
import { SmallCard } from "./Card";

const Word = ({ word }) => (
  <div className="flex flex-row justify-center w-full">
    {word.map((c, i) => (
      <SmallCard key={i} letter={c.letter} />
    ))}
  </div>
);

const Words = ({ players }) => {
  const anyWords = players.some((p) => p.words?.length > 0);

  // TODO: max width needs to be based on # of players (or use grid?)
  return (
    <div className="flex flex-row w-full">
      {anyWords &&
        players.map((p, i) => (
          <div key={i} className="flex-grow max-w-[50%] pt-2 text-center">
            {p.words?.length > 0 && p.words.map((w, j) => <Word key={j} word={w} />)}
          </div>
        ))}
    </div>
  );
};

export default Words;

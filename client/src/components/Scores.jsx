import React from "react";

const Scores = ({ players }) => {
  return (
    <div className="flex flex-row w-full">
      {players.map((p, i) => (
        <div
          key={i}
          className="flex-grow h-16 pt-2 text-center text-white bg-black"
        >
          {p.name}
          <br />
          {p.hasGoneOut
            ? `${p.totalScore - p.roundScore} + ${p.roundScore} = ${
                p.totalScore
              }`
            : p.totalScore}
        </div>
      ))}
    </div>
  );
};

export default Scores;

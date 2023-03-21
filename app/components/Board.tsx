import { GameData } from "../models/GameData";
import Square from "./Square";

export default function ({ data }: { data: GameData }) {
  const slen = Math.floor(Math.sqrt(data.board.length));
  return (
    <>
      {data.winner && (
        <div style={{ marginBottom: "1rem" }}>
          Winner: <strong>{data.winner}</strong>
        </div>
      )}
      {!data.winner && (
        <div style={{ marginBottom: "1rem" }}>
          Current Player: <strong>{data.turn}</strong>
        </div>
      )}
      {Array.apply(null, Array(slen)).map((_, row) => (
        <div key={row} style={{ display: "flex" }}>
          {Array.apply(null, Array(slen)).map((_, col) => (
            <Square
              key={col}
              pos={row * slen + col}
              value={data.board[row * slen + col]}
              turn={data.turn}
            />
          ))}
        </div>
      ))}
    </>
  );
}

import { Button } from "@mui/material";
import { ActionArgs, LoaderArgs } from "@remix-run/cloudflare";
import { Link } from "@remix-run/react";
import Board from "~/components/Board";
import { getGameData } from "~/models/GameData";

export async function loader({ context, params }: LoaderArgs) {
  return getGameData(context.KV as KVNamespace, params?.gameId);
}

export async function action({ context, params, request }: ActionArgs) {
  const formData = await request.formData();
  const kv = context.KV as KVNamespace;
  const data = await getGameData(kv, params.gameId);
  const pos = parseInt(formData.get("pos")?.toString() || "-1");
  if (pos >= 0 && (data.winner || data.board[pos])) {
    console.log(`Invalid move ${pos} for ${params.gameId}:`, data);
    return {};
  }

  data.board[pos] = data.turn;
  data.turn = data.turn === "X" ? "O" : "X";
  data.winner = calculateWinner(data.board);
  await kv.put(`ttt/game/${params.gameId}`, JSON.stringify(data));
  console.log(`Current data for move ${pos} in ${params.gameId}:`, data);
  return {};
}

function calculateWinner(squares: string[]) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default function () {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        justifyItems: "flex-start",
      }}
    >
      <div>
        <Board />
      </div>
      <Link to="/" style={{ textDecoration: "none" }}>
        <Button variant="outlined">Wrong game?</Button>
      </Link>
    </section>
  );
}

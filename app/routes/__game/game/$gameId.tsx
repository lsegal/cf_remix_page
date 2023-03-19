import { Button } from "@mui/material";
import { ActionArgs, LoaderArgs, redirect } from "@remix-run/cloudflare";
import { Form, Link, useLoaderData, useRevalidator } from "@remix-run/react";
import { useState } from "react";
import { useInterval } from "usehooks-ts";

type GameData = {
  board: string[];
  turn: string;
  winner: string | null;
};

async function getGameData(kv: KVNamespace, gameId: string | undefined) {
  if (!gameId) throw new Error("Game ID is required");
  return JSON.parse(
    (await kv.get(`ttt/game/${gameId}`)) ||
      JSON.stringify({ board: Array(9).fill(null), turn: "X" })
  ) as GameData;
}

export async function loader({ context, params }: LoaderArgs) {
  return getGameData(context.KV as KVNamespace, params?.gameId);
}

export async function action({ context, params, request }: ActionArgs) {
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  const formData = await request.formData();
  const kv = context.KV as KVNamespace;
  const data = await getGameData(kv, params.gameId);
  const pos = parseInt(formData.get("pos")?.toString() || "-1");
  if (pos >= 0 && (data.winner || data.board[pos])) {
    return redirect(`/game/${params.gameId}`);
  }

  data.board[pos] = data.turn;
  data.turn = data.turn === "X" ? "O" : "X";
  data.winner = calculateWinner(data.board);
  kv.put(`ttt/game/${params.gameId}`, JSON.stringify(data));
  return redirect(`/game/${params.gameId}`);
}

function Square({ pos, value }: { pos: number; value: string }) {
  const [mouseOver, setMouseOver] = useState(false);
  const data = useLoaderData<typeof loader>();
  if (!data) {
    throw new Error("failed to load game");
  }

  const isPlaceholder = mouseOver && !value;
  return (
    <Form method="post">
      <input type="hidden" name="pos" value={pos} />
      <Button
        variant="outlined"
        type="submit"
        onMouseOver={() => setMouseOver(true)}
        onMouseOut={() => setMouseOver(false)}
        style={{
          borderRadius: 0,
          width: "0.2rem",
          height: "3.6rem",
          fontWeight: isPlaceholder ? "normal" : "bold",
        }}
      >
        <span style={{ opacity: isPlaceholder ? 0.3 : 1 }}>
          {isPlaceholder ? data.turn : value}
        </span>
      </Button>
    </Form>
  );
}

function Board() {
  const data = useLoaderData<typeof loader>();
  if (!data) {
    throw new Error("failed to load game");
  }

  const revalidator = useRevalidator();
  useInterval(() => {
    if (revalidator.state === "idle" && !data.winner) {
      revalidator.revalidate();
    }
  }, 1000);

  const slen = Math.floor(Math.sqrt(data.board.length));
  return (
    <>
      {data.winner && (
        <div className="status" style={{ marginBottom: "1rem" }}>
          Winner: <strong>{data.winner}</strong>
        </div>
      )}
      {!data.winner && (
        <div className="status" style={{ marginBottom: "1rem" }}>
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
            />
          ))}
        </div>
      ))}
    </>
  );
}

export default function () {
  return (
    <>
      <Board />
      <div style={{ marginTop: "1rem" }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Wrong game?</Button>
        </Link>
      </div>
    </>
  );
}

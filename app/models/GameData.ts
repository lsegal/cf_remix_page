export type GameData = {
  board: string[];
  turn: string;
  winner: string | null;
};

export async function getGameData(kv: KVNamespace, gameId: string | undefined) {
  if (!gameId) throw new Error("Game ID is required");
  return JSON.parse(
    (await kv.get(`ttt/game/${gameId}`)) ||
    JSON.stringify({ board: Array(9).fill(null), turn: "X" })
  ) as GameData;
}

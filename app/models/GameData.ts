export type GameData = {
  board: string[];
  turn: string;
  winner: string | null;
};

export async function getGameData(kv: KVNamespace, gameId: string | undefined) {
  if (!gameId) throw new Error("Game ID is required");
  return (await kv.get<GameData>(`ttt/game/${gameId}`, { type: 'json' })) ||
    { board: Array(9).fill(null), turn: "X", winner: null };
}

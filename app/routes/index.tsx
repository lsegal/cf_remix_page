import { Button, TextField } from "@mui/material";
import { useNavigate } from "@remix-run/react";

export default function () {
  const nav = useNavigate();
  const go = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const game = form.elements.namedItem("game") as HTMLInputElement;
    nav(`/game/${game.value}`);
  };

  const newGame = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    nav(`/game/${crypto.randomUUID()}`);
  };

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        width: "260px",
      }}
    >
      <form onSubmit={newGame}>
        <Button variant="outlined" type="submit">
          Create a New Game
        </Button>
      </form>
      <div style={{ marginBottom: "1rem" }}>- or -</div>
      <form
        onSubmit={go}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <label htmlFor="game">Enter Game ID:</label>
        <TextField type="text" name="game" />
        <Button variant="outlined" type="submit">
          Go
        </Button>
      </form>
    </section>
  );
}

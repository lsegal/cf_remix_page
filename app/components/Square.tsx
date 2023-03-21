import { Button } from "@mui/material";
import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { GameData } from "../models/GameData";

export default function ({ pos, value }: { pos: number; value: string }) {
  const [mouseOver, setMouseOver] = useState(false);
  const data = useLoaderData<GameData>();
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

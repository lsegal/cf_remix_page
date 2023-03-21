import { Button } from "@mui/material";
import { Form } from "@remix-run/react";
import { useState } from "react";

export default function ({
  pos,
  value,
  turn,
}: {
  pos: number;
  value: string;
  turn: string;
}) {
  const [mouseOver, setMouseOver] = useState(false);
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
          {isPlaceholder ? turn : value}
        </span>
      </Button>
    </Form>
  );
}

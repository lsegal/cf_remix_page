import { Button } from "@mui/material";
import { ActionFunction, json, redirect } from "@remix-run/cloudflare";
import { Form, Link } from "@remix-run/react";
import { motion } from "framer-motion";

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
  };
};

export const action: ActionFunction = async ({ request, context }) => {
  const formData = await request.formData();
  const title = formData.get("title");
  const body = formData.get("body");

  if (typeof title !== "string" || title.length === 0) {
    return json<ActionData>(
      { errors: { title: "Title is required" } },
      { status: 400 }
    );
  }

  if (typeof body !== "string" || body.length === 0) {
    return json<ActionData>(
      { errors: { body: "Body is required" } },
      { status: 400 }
    );
  }

  const kv = context.KV as KVNamespace;
  const slug = title.toLowerCase().replace(/\W/g, "_");
  await kv.put(`item/${slug}`, JSON.stringify({ title, body }), {
    metadata: { type: "json" },
  });

  return redirect(`/posts/${slug}`);
};

export default function () {
  return (
    <div>
      <Link to="/">Home</Link>
      <Form
        method="post"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <label>Title</label>
        <input type="text" name="title" />
        <label>Body</label>
        <textarea name="body" />
        <Button type="submit" variant="contained">
          Create Post
        </Button>
      </Form>
    </div>
  );
}

import { ActionFunction, json, redirect } from "@remix-run/cloudflare";
import { Form } from "@remix-run/react";

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

  return redirect(`/posts/1`);
};

export default function () {
  return (
    <div>
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
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: "blue",
            color: "white",
          }}
        >
          Create Post
        </button>
      </Form>
    </div>
  );
}

import { Button, Container, Typography } from "@mui/material";
import { ActionArgs, json, LoaderArgs, redirect } from "@remix-run/cloudflare";
import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  useLoaderData,
} from "@remix-run/react";

export const loader = async ({ context, params }: LoaderArgs) => {
  const kv = context.KV as KVNamespace;
  const data = await kv.get<{ title: string; body: string }>(
    `item/${params.id}`,
    {
      type: "json",
    }
  );
  return json(data);
};

async function deletePost(id: string, context: LoaderArgs["context"]) {
  const kv = context.KV as KVNamespace;
  await kv.delete(`item/${id}`);
}

export async function action({ context, request, params }: ActionArgs) {
  if (request.method !== "DELETE") return;
  if (!params.id) return;
  await deletePost(params.id, { KV: context.KV });
  return redirect("/");
}

export default function () {
  const post = useLoaderData<typeof loader>();

  if (!post) {
    return (
      <html>
        <head>
          <title>Oh no!</title>
          <Meta />
          <Links />
        </head>
        <body>
          <h1>Oops!</h1>
          <Outlet />
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <>
      <Link to="/">Home</Link>
      <Container
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Typography variant="h5">{post?.title}</Typography>
        <Form method="delete">
          <Button type="submit" variant="contained">
            Delete
          </Button>
        </Form>
      </Container>
      <Container>{post?.body}</Container>
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Oops!</h1>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}

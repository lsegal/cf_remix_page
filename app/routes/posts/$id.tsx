import { json, LoaderArgs } from "@remix-run/cloudflare";
import { Links, Meta, Outlet, Scripts, useLoaderData } from "@remix-run/react";

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

export default function () {
  const post = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.body}</p>
    </div>
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

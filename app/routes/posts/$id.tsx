import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Links, Meta, Outlet, Scripts, useLoaderData } from "@remix-run/react";

export const loader = async ({ context, params }: LoaderArgs) => {
  const kv = context.KV as KVNamespace;
  return await kv.get(`item-${params.id}`);
};

export default function Product() {
  const product = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Product</p>
      {product}
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

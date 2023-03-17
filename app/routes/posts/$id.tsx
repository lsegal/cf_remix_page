import type { LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Links, Meta, Outlet, Scripts, useLoaderData } from "@remix-run/react";

export const loader = async ({ context, params }: LoaderArgs) => {
  console.log(context);
  const kv = context.KV as {
    get: (key: string, args: any) => Promise<{ name: string }>;
  };
  return json(
    await kv.get(`product-${params.id}`, {
      type: "json",
    })
  );
};

export default function Product() {
  const product = useLoaderData<typeof loader>();

  if (!product) throw new Response(null, { status: 404 });

  return (
    <div>
      <p>Product</p>
      {product.name}
      <p>Products</p>
      {/* ... */}
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

import { LoaderArgs, MetaFunction } from "@remix-run/cloudflare";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

async function getPost(id: string, context: LoaderArgs["context"]) {
  const kv = context.KV as KVNamespace;
  const data = await kv.get<{ id: string; title: string; body: string }>(id, {
    type: "json",
  });
  if (data) data.id = id.split("/")[1];
  return data;
}

export const loader = async ({ context, params }: LoaderArgs) => {
  const kv = context.KV as KVNamespace;
  const items = await kv.list({
    prefix: "item/",
    limit: 10,
    cursor: params.next,
  });

  return {
    cursor: items.cursor,
    items: await Promise.all(
      items.keys.map(async (item) => getPost(item.name, context))
    ),
  };
};

export default function App() {
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <div
          style={{
            fontFamily: "system-ui, sans-serif",
            lineHeight: "1.4",
            display: "flex",
            marginRight: "10rem",
            gap: "1rem",
          }}
        >
          <nav style={{ flexGrow: "1", margin: "2rem" }}>
            <ul>
              {data.items.map((item) => (
                <li key={item?.id}>
                  <Link to={`/posts/${item?.id}`}>{item?.title}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div style={{ flexGrow: "10" }}>
            <h1>Blog posts</h1>
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
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

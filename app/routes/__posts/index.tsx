import { Container, List, ListItem } from "@mui/material";
import { LoaderArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";

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

export default function () {
  const data = useLoaderData<typeof loader>();
  return (
    <List>
      <ListItem>
        <Link to="/posts/new">New Post</Link>
      </ListItem>
      {data.items.map((item) => (
        <ListItem key={item?.id}>
          <Link to={`/posts/${item?.id}`}>{item?.title}</Link>
        </ListItem>
      ))}
    </List>
  );
}

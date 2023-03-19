import { redirect } from "@remix-run/cloudflare";

export async function action() {
  return redirect(`/game/${crypto.randomUUID()}`);
}

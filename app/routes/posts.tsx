import { Link, Outlet } from "@remix-run/react";

export default function Index() {
  return (
    <div>
      <Outlet />
      <Link to="/">Home</Link>
    </div>
  );
}

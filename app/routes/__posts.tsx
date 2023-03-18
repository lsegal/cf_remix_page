import { Typography } from "@mui/material";
import { Outlet } from "@remix-run/react";

export default function () {
  return (
    <>
      <Typography variant="h4">Blog posts</Typography>
      <Outlet />
    </>
  );
}

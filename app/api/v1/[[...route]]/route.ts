import { Hono } from "hono";
import { handle } from "hono/vercel";

import accounts from "./(routes)/accounts";

const app = new Hono().basePath("/api/v1");

app.get("/", (c) => {
  return c.json({ msg: "Hello Hono!" });
});

const routes = app.route("/accounts", accounts);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;

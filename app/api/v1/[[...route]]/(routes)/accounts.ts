import { Hono } from "hono";

import { db } from "@/db/drizzle";
import { accounts } from "@/db/schemas/index";
import { sql } from "drizzle-orm";

const app = new Hono().get("/", async (c) => {
  const { email, password } = c.req.param();
  // const data = await db.execute(
  //   sql`SELECT * FROM ${accounts} WHERE ${accounts.email} = ${email}`
  // );

  // return c.json({ data });
});

export default app;

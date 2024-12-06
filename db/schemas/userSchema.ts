import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { v7 as uuidv7 } from "uuid";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text("name"),
  email: text("email").unique(),
  password: text("password"),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  joinedAt: timestamp().notNull().defaultNow(),
});

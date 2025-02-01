import { pgTable, text, decimal } from "drizzle-orm/pg-core";

import { v7 as uuidv7 } from "uuid";
import { users } from "./userSchema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const wallets = pgTable("wallet", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text("name").notNull(),
  description: text("description"),
  initialBalance: decimal("initialBalance"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const insertWalletSchema = createInsertSchema(wallets);
export const selectWalletSchema = createSelectSchema(wallets);

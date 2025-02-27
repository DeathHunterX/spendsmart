import { pgTable, text, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

import { v7 as uuidv7 } from "uuid";

// Other Schemas
import { users } from "./user.schema";
import { transactions } from "./transaction.schema";

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

export const walletsRelation = relations(wallets, ({ many }) => ({
  transactions: many(transactions),
}));

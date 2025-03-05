import { pgTable, text, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

import { v7 as uuidv7 } from "uuid";

import { users } from "./user.schema";
import { transactions } from "./transaction.schema";

export const categoryTypeEnum = pgEnum("type", ["income", "expense"]);

export const categories = pgTable("category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text("name").notNull(),
  type: categoryTypeEnum(),
  icon: text("icon"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);

export const categoriesRelation = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

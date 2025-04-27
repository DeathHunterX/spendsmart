import { pgTable, text, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";

import { v7 as uuidv7 } from "uuid";

import { users } from "./user.schema";
import { transactions } from "./transaction.schema";

// Enums
export const categoryTypeEnum = pgEnum("categoryTypeEnum", [
  "income",
  "expense",
]);

// Tables
export const categories = pgTable("category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text("name").notNull(),
  categoryType: categoryTypeEnum(),
  icon: text("icon"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Relations
export const categoriesRelation = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

// Schemas
export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);

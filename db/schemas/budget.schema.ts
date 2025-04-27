import {
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

import { wallets } from "./wallet.schema";
import { relations } from "drizzle-orm";
import { categories } from "./category.schema";
import { createInsertSchema } from "drizzle-zod";

// Enums
export const periodOfTimeEnum = pgEnum("periodEnum", [
  "day",
  "week",
  "month",
  "quarter",
  "year",
  "overtime",
]);

// Tables
export const budgets = pgTable("budget", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  categoryId: text("categoryId").references(() => categories.id, {
    onDelete: "cascade",
  }),

  period: periodOfTimeEnum().notNull(),
  amount: integer("amount").notNull(),
});

// Junction Table
export const walletToBudgets = pgTable(
  "wallet_budgets",
  {
    walletId: text("walletId").references(() => wallets.id, {
      onDelete: "cascade",
    }),
    budgetId: text("budgetId").references(() => budgets.id, {
      onDelete: "cascade",
    }),
  },
  (t) => [primaryKey({ columns: [t.walletId, t.budgetId] })]
);

// Relations
export const budgetsRelations = relations(budgets, ({ one, many }) => ({
  walletToBudgets: many(walletToBudgets),
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id],
  }),
}));

// Schemas
export const insertBudgetSchema = createInsertSchema(budgets);
export const selectBudgetSchema = createInsertSchema(budgets);

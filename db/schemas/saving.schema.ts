import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";

import { relations } from "drizzle-orm";
import { users } from "./user.schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const coverTypeEnum = pgEnum("coverTypeEnum", ["icon", "photo"]);
export const savingGoalStatus = pgEnum("savingStatusEnum", [
  "active",
  "completed",
  "cancelled",
]);

export const savingRecordType = pgEnum("recordTypeEnum", [
  "savings",
  "withdrawals",
]);

export const savingGoals = pgTable("saving_goal", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  coverType: coverTypeEnum().notNull(),
  coverImg: text("coverImg"),
  name: text("name"),
  notes: text("notes"),
  savedAmount: integer("savedAmount").notNull(),
  targetAmount: integer("amount").notNull(),
  deadline: timestamp("deadline", { mode: "date" }),
  status: savingGoalStatus(),
  userId: text("userId")
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
});

export const savingRecords = pgTable("saving_record", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  amount: integer("amount").notNull(),
  recordType: savingRecordType().notNull(), // savings || withdrawals
  date: timestamp("date").notNull(),
  notes: text("notes"),
  goalId: text("goalId").references(() => savingGoals.id, {
    onDelete: "cascade",
  }),
});

// Relations
export const savingGoalRelations = relations(savingGoals, ({ many }) => ({
  savingRecords: many(savingRecords),
}));

export const savingRecordRelations = relations(savingRecords, ({ one }) => ({
  savingGoal: one(savingGoals, {
    fields: [savingRecords.goalId],
    references: [savingGoals.id],
  }),
}));

// Schemas
export const insertSavingGoalSchema = createInsertSchema(savingGoals, {
  deadline: z.coerce.date(),
});
export const insertSavingRecordSchema = createInsertSchema(savingRecords, {
  date: z.coerce.date(),
  amount: z.number().gt(0, { message: "Amount is required" }),
});

export const selectSavingGoalSchema = createSelectSchema(savingGoals);
export const selectSavingRecordSchema = createSelectSchema(savingRecords);

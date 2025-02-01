import { pgTable, text } from "drizzle-orm/pg-core";

import { v7 as uuidv7 } from "uuid";
import { users } from "./userSchema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const categories = pgTable("category", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text("name").notNull(),
  description: text("description"),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const insertCategorySchema = createInsertSchema(categories);
export const selectCategorySchema = createSelectSchema(categories);

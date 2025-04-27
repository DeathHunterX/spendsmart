import {
  pgTable,
  text,
  primaryKey,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";
import { v7 as uuidv7 } from "uuid";

import { users } from "./user.schema";
import { createSelectSchema } from "drizzle-zod";
import { InferSelectModel, relations } from "drizzle-orm";

// Tables
export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    password: text("password"),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
);

export const verificationTokens = pgTable(
  "verificationToken",
  {
    id: text("id").$defaultFn(() => uuidv7()),
    email: text("email").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.email, verificationToken.token],
    }),
  })
);

// Relations
export const accountRelation = relations(accounts, ({ one }) => ({
  users: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

// Schemas
export const getAccountSchema = createSelectSchema(accounts);

export type Account = InferSelectModel<typeof accounts>;

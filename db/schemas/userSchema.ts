import { pgTable, text, timestamp, numeric } from "drizzle-orm/pg-core";
import { createUpdateSchema } from "drizzle-zod";

import { v7 as uuidv7 } from "uuid";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  phoneNumber: numeric("phoneNumber"),
  phoneCode: text("phone"),
  address: text("address"),
  joinedAt: timestamp().notNull().defaultNow(),
});

export const updateUserSchema = createUpdateSchema(users);

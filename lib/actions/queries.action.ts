import { db } from "@/db/drizzle";
import { accounts, users } from "@/db/schemas";
import { Account, User } from "@/types/global";
import { sql } from "drizzle-orm";

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await db
    .execute(
      sql`SELECT DISTINCT * FROM ${users} WHERE ${users.email} = ${email}`
    )
    .then((res) => res.rows[0] ?? null);
  return user as unknown as User | null;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const user = await db
    .execute(sql`SELECT DISTINCT * FROM ${users} WHERE ${users.id} = ${id}`)
    .then((res) => res.rows[0] ?? null);

  return user as unknown as User | null;
};

export const getAccountById = async (id: string): Promise<Account | null> => {
  const account = await db
    .execute(
      sql`SELECT DISTINCT * FROM ${accounts} WHERE ${accounts.userId} = ${id}`
    )
    .then((res) => res.rows[0] ?? null);

  return account as unknown as Account | null;
};

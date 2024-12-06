"use server";
import { db } from "@/db/drizzle";
import { sql } from "drizzle-orm";

// Schemas
import { users, verificationTokens } from "@/db/schemas";
// UUID
import { v7 as uuidv7 } from "uuid";
import { getUserByEmail } from "./signUp.action";

import handleError from "@/lib/handlers/error";

import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/lib/http-error";
import { ActionResponse, ErrorResponse } from "@/types/global";

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.execute(
      sql`SELECT DISTINCT * FROM ${verificationTokens} WHERE ${verificationTokens.token} = ${token}`
    );

    return verificationToken.rows[0];
  } catch {
    return null;
  }
};

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.execute(
      sql`SELECT DISTINCT * FROM ${verificationTokens} WHERE ${verificationTokens.email} = ${email}`
    );

    return verificationToken.rows[0];
  } catch {
    return null;
  }
};

export const generateVerificationToken = async (email: string) => {
  const token = uuidv7();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.execute(
      sql`DELETE FROM ${verificationTokens} where ${verificationTokens.id} = ${existingToken.id}`
    );
  }

  const [newToken] = await db
    .insert(verificationTokens)
    .values({ email, token, expires })
    .returning();

  return newToken;
};

export const verifyEmailByToken = async (
  token: string
): Promise<ActionResponse> => {
  try {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      throw new NotFoundError("Token does not exist!");
    }

    if (
      typeof existingToken.email !== "string" ||
      typeof existingToken.expires !== "string"
    ) {
      throw new ConflictError("Invalid field data type");
    }

    const hasExpired =
      new Date(existingToken.expires).getTime() > new Date().getTime();

    if (hasExpired) {
      throw new UnauthorizedError("Token has expired!");
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
      throw new NotFoundError("Email does not exist!");
    }

    await db.execute(
      sql`
      UPDATE ${users}
      SET "emailVerified" = ${new Date()}, email = ${existingToken.email}
      WHERE ${users.id} = ${existingUser.id}
    `
    );

    await db.execute(
      sql`DELETE FROM ${verificationTokens} where ${verificationTokens.id} = ${existingToken.id}`
    );

    return { success: true, status: 200 };
  } catch (error) {
    return handleError(error, "server") as ErrorResponse;
  }
};

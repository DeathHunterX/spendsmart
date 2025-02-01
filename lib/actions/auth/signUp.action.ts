"use server";
// Database
import { db } from "@/db/drizzle";
import { sql } from "drizzle-orm";

// Schema
import { accounts, users } from "@/db/schemas";
import { SignUpSchema } from "@/lib/validation";

// Error handling
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/lib/http-error";
import handleError from "@/lib/handlers/error";
import { ActionResponse, ErrorResponse } from "@/types/global";

import bcryptjs from "bcryptjs";
import { z } from "zod";

import { generateVerificationToken } from "./verificationToken.action";
import { sendVerificationEmail } from "./sendMail.action";
import { getAccountById, getUserByEmail } from "../queries.action";

export async function signUpWithCredentials(
  params: z.infer<typeof SignUpSchema>
): Promise<ActionResponse> {
  try {
    const validatedFields = SignUpSchema.safeParse(params);
    if (!validatedFields.success) {
      throw new ValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const { name, email, password } = validatedFields.data;
    const hashedPassword = await bcryptjs.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser && existingUser.emailVerified) {
      throw new ConflictError(
        "The provided email address is already registered"
      );
    } else {
      await db.execute(
        sql`DELETE FROM ${users} WHERE ${users.email} = ${email}`
      );
    }

    const [newUser] = await db
      .insert(users)
      .values({ name, email })
      .returning();

    await db.insert(accounts).values({
      userId: newUser.id,
      type: "email",
      provider: "credentials",
      providerAccountId: email,
      password: hashedPassword,
    });

    // TODO: Send email verification token
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success: true,
      status: 201,
    };
  } catch (error) {
    return handleError(error, "server") as ErrorResponse;
  }
}

export async function verifyUserCredentials(params: any) {
  try {
    const { email, password } = params;
    if (!email && !password) {
      return {
        success: false,
        user: null,
        error: "You need to fill all the required!",
      };
    }
    const existingUser = await getUserByEmail(email);
    if (!existingUser) throw new NotFoundError("User");

    const existingAccount = await getAccountById(existingUser.id!);

    if (!existingAccount) throw new NotFoundError("Account");

    if (!existingAccount?.password) {
      return {
        success: false,
        user: null,
        error: "Password is required!",
      };
    }
    const isPasswordMatches = await bcryptjs.compare(
      password,
      existingAccount.password
    );

    if (!isPasswordMatches) {
      return {
        success: false,
        user: null,
        error: "Password is incorrect.",
      };
    }

    // Return the user data as a successful response
    return {
      success: true,
      user: existingUser,
      status: 200,
    };
  } catch (error) {
    return handleError(error, "server") as ErrorResponse;
  }
}

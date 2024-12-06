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

// Types
// import { Account } from "@/types";
import bcryptjs from "bcryptjs";

// import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ActionResponse, ErrorResponse } from "@/types/global";
import { UserParams } from "@/types";
import { generateVerificationToken } from "./verificationToken.action";
import { sendVerificationEmail } from "./sendMail.action";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.execute(
      sql`SELECT DISTINCT * FROM ${users} WHERE ${users.email} = ${email}`
    );

    return user.rows[0];
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.execute(
      sql`SELECT DISTINCT * FROM ${users} WHERE ${users.id} = ${id}`
    );

    return user.rows[0];
  } catch {
    return null;
  }
};

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
      .values({ name, email, password: hashedPassword })
      .returning();

    await db.insert(accounts).values({
      userId: newUser.id,
      type: "email",
      provider: "credentials",
      providerAccountId: email,
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
    const existedUser: UserParams | null = await getUserByEmail(email);
    if (!existedUser) {
      throw new NotFoundError("User");
    }
    if (!existedUser.password) {
      return {
        success: false,
        user: null,
        error: "Password is required!",
      };
    }
    const isPasswordMatches = await bcryptjs.compare(
      password,
      existedUser.password
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
      user: existedUser,
      status: 200,
    };
  } catch (error) {
    return handleError(error, "server") as ErrorResponse;
  }
}

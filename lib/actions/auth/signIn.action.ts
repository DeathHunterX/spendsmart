"use server";
import { signIn } from "@/auth";

import { SignInSchema } from "@/lib/validation";
import { z } from "zod";

import { AuthError } from "next-auth";
import {
  ConflictError,
  InternalServerError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/http-error";
import handleError from "@/lib/handlers/error";
import { ActionResponse, ErrorResponse } from "@/types/global";
import { getUserByEmail } from "../queries.action";

export const signInWithCredentials = async (
  params: z.infer<typeof SignInSchema>
): Promise<ActionResponse> => {
  const validatedFields = SignInSchema.safeParse(params);
  if (!validatedFields.success) {
    return handleError(
      new ValidationError(validatedFields.error.flatten().fieldErrors),
      "server"
    ) as ErrorResponse;
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return handleError(
      new ConflictError(
        "The provided email is not registered. Please sign up your account!"
      )
    ) as ErrorResponse;
  }

  if (!existingUser.emailVerified) {
    return handleError(
      new ConflictError(
        "Your account isn't verified. Please verify it to use our services"
      )
    ) as ErrorResponse;
  }

  try {
    /* Attempt to sign in using provided credentials
     * Bug: There is a bug which after signIn successfully, it doesn't refresh in the server-side
     */

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true, status: 200 };
  } catch (error) {
    // Handle known authentication errors
    if (error instanceof AuthError) {
      const { type, cause } = error;

      switch (type) {
        case "CredentialsSignin":
          return handleError(
            new UnauthorizedError("Invalid Credentials"),
            "server"
          ) as ErrorResponse;
        case "CallbackRouteError":
          return handleError(
            new InternalServerError(
              cause?.err?.toString() || "Callback route error"
            ),
            "server"
          ) as ErrorResponse;

        case "AccessDenied":
          return handleError(
            new UnauthorizedError(
              "Access Denied! You need to verify your mail"
            ),
            "server"
          ) as ErrorResponse;
        default:
          return handleError(
            new InternalServerError("An authentication error occurred"),
            "server"
          ) as ErrorResponse;
      }
    }
    throw error;
  }
};

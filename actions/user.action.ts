"use server";
import { signIn } from "@/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/schemas";
import { SignInSchema, SignUpSchema } from "@/lib/validation";
import { Account } from "@/types";
import bcryptjs from "bcryptjs";
import { sql } from "drizzle-orm";
import { AuthError } from "next-auth";

// import { revalidatePath } from "next/cache";
import { z } from "zod";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.execute(
      sql`SELECT DISTINCT * FROM ${users} WHERE ${users.email} = ${email}`
    );

    return user.rows[0];
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.execute(
      sql`SELECT DISTINCT * FROM ${users} WHERE ${users.id} = ${id}`
    );

    return user;
  } catch {
    return null;
  }
};

export async function register(params: z.infer<typeof SignUpSchema>) {
  try {
    const validatedFields = SignUpSchema.safeParse(params);
    if (!validatedFields.success) {
      return {
        success: false,
        error: {
          code: "INVALID_INPUT",
          details:
            "Invalid fields. Please check if you fill right your account!",
        },
        message: "User registration failed",
        status: 400, // HTTP Bad Request
      };
    }

    const { name, email, password } = validatedFields.data;
    const hashedPassword = await bcryptjs.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return {
        success: false,
        error: {
          code: "EMAIL_ALREADY_IN_USE",
          details: "The provided email address is already registered",
        },
        message: "User registration failed",
        status: 409, // HTTP Conflict: email already exists
      };
    }

    await db.insert(users).values({ name, email, password: hashedPassword });

    // TODO: Send email verification token

    return {
      success: true,
      message: "User registered successfully",
      status: 201,
    };
  } catch (error) {
    console.error("Registration error:", error); // Log the error for debugging

    // Return a more informative response in case of unexpected errors
    return {
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        details: "An unexpected error occurred during user registration.",
      },
      message: "User registration failed",
      status: 500, // HTTP Internal Server Error
    };
  }
}

export async function login(params: z.infer<typeof SignInSchema>) {
  const { email, password } = params;

  try {
    // Attempt to sign in using provided credentials
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false, // Set to false to handle redirects manually
    });

    console.log(response);

    // // Check if signIn response indicates an error
    // if (response?.error) {
    //   return {
    //     success: false,
    //     error: "Invalid credentials!",
    //     status: 401, // Unauthorized status code
    //   };
    // }

    // // If no error, handle redirect manually if needed
    // if (response?.ok) {
    //   return {
    //     success: true,
    //     message: "Login successful",
    //     redirectTo: "/dashboard",
    //     status: 200, // HTTP OK
    //   };
    // }
  } catch (error) {
    // Handle known authentication errors
    if (error instanceof AuthError) {
      const { type, cause } = error;

      switch (type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: "Invalid credentials!",
            status: 401, // Unauthorized
          };
        case "CallbackRouteError":
          return {
            success: false,
            error: cause?.err?.toString() || "Callback route error",
            status: 500, // Internal Server Error
          };
        default:
          return {
            success: false,
            error: "An authentication error occurred",
            status: 500,
          };
      }
    }

    // Catch any other unexpected errors
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: 500, // Internal Server Error
    };
  }
}

export async function verifyUserCredentials(params: any) {
  try {
    console.log(params);
    const { email, password } = params;

    if (!email && !password) {
      return {
        success: false,
        user: null,
        error: "You need to fill all the required!",
      };
    }

    const existedUser: Account | undefined = await getUserByEmail(email);

    if (!existedUser) {
      return {
        success: false,
        user: null,
        error: "Unknown user!",
      };
    }

    if (!existedUser.password) {
      return {
        success: false,
        user: null,
        error: "Password is required!",
      };
    }

    // const isPasswordMatches = bcrypt.compare(password, existedUser.password);

    // if (!isPasswordMatches) {
    //   return {
    //     success: false,
    //     user: null,
    //     error: "Password is incorrect.",
    //   };
    // }

    // Return the user data as a successful response
    return {
      success: true,
      user: existedUser,
    };
  } catch (error) {
    return {
      success: false,
      user: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

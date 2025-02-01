import { NextResponse } from "next/server";
import handleError from "@/lib/handlers/error";
import { accounts, getAccountSchema } from "@/db/schemas";
import { NotFoundError, ValidationError } from "@/lib/http-error";
import { APIErrorResponse } from "@/types/global";
import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const { providerAccountId } = await request.json();

  try {
    const validatedData = getAccountSchema.partial().safeParse({
      providerAccountId,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const account = await db
      .select()
      .from(accounts)
      .where(eq(accounts.providerAccountId, providerAccountId));
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

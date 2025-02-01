import { db } from "@/db/drizzle";
import handleError from "@/lib/handlers/error";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import { users } from "@/db/schemas";

// GET /api/users
export async function GET() {
  try {
    const result = await db.select().from(users);

    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// POST /api/users
export async function POST() {
  try {
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

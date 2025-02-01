import { db } from "@/db/drizzle";
import { users } from "@/db/schemas";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-error";
import { APIErrorResponse } from "@/types/global";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// GET /api/users/[id]
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) throw new NotFoundError("User");

  try {
    const userData = await db.select().from(users).where(eq(users.id, id));
    if (!userData) throw new NotFoundError("User");

    return NextResponse.json(
      { success: true, data: userData },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

// PUT /api/users/[id]
// export async function PUT(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   const { id } = await params;

//   if (!id) throw new NotFoundError("User");

//   try {
//     const body = await request.json();
//     const validateData = updateUserSchema.partial().parse(body);

//     const updatedUser = await db
//       .update(users)
//       .set(validateData)
//       .returning({ updatedData: users });

//     if (!updatedUser) throw new NotFoundError("User");

//     return NextResponse.json(
//       { success: true, data: updatedUser },
//       { status: 200 }
//     );
//   } catch (error) {
//     return handleError(error, "api") as APIErrorResponse;
//   }
// }

// DELETE /api/users/[id]
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) throw new NotFoundError("User");

  try {
    const userData = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ deletedId: users.id });
    if (!userData) throw new NotFoundError("User");

    return NextResponse.json(
      { success: true, data: userData },
      { status: 200 }
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

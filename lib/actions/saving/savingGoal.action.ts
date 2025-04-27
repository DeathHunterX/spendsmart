"use server";
// Database
import { db } from "@/db/drizzle";
import { and, desc, eq, sql } from "drizzle-orm";

// Schema
import {
  insertSavingGoalSchema,
  savingGoals,
  savingRecords,
} from "@/db/schemas";

// Server action & response
import action from "../../handlers/action";
import handleError from "../../handlers/error";

// Types
import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  SavingGoal,
} from "@/types/global";

// Other
import { revalidatePath } from "next/cache";
import {
  DeleteSavingGoalSchema,
  EditSavingGoalSchema,
  GetSavingGoalByIdSchema,
  PaginatedSearchParamsSchema,
} from "../../validation";

// Add Saving goal action - POST method
export const addSavingGoal = async (
  params: CreateSavingGoalParams
): Promise<ActionResponse<SavingGoal>> => {
  const validationResult = await action({
    params,
    schema: insertSavingGoalSchema.omit({
      id: true,
      savedAmount: true,
      userId: true,
    }),
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { coverType, coverImg, name, notes, targetAmount, deadline, status } =
    validationResult.params!;
  const userId = validationResult?.session?.user?.id!;

  try {
    const [newSavingGoal] = await db
      .insert(savingGoals)
      .values({
        coverType,
        coverImg,
        name,
        notes,
        savedAmount: 0,
        targetAmount,
        deadline,
        status,
        userId: userId,
      })
      .returning();

    if (!newSavingGoal) {
      throw new Error("Failed to create a saving goal");
    }

    revalidatePath("/saving-goals");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newSavingGoal)),
      status: 201,
    };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

// Get Saving goals action - GET method
export const getSavingGoalData = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<SavingGoal>> => {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const userId = validationResult.session?.user?.id!;

  try {
    const savingGoal = await db
      .select()
      .from(savingGoals)
      .where(eq(savingGoals.userId, userId))
      .orderBy(desc(savingGoals.savedAmount));

    if (!savingGoal) throw new Error("Saving goals not found");

    return { success: true, data: JSON.parse(JSON.stringify(savingGoal)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const getSavingGoalById = async (
  params: GetSavingGoalByIdParams
): Promise<ActionResponse<SavingGoal>> => {
  const validationResult = await action({
    params,
    schema: GetSavingGoalByIdSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { goalId } = validationResult.params!;
  const userId = validationResult.session?.user?.id!;
  try {
    const [savingGoal] = await db
      .select({
        coverImg: savingGoals.coverImg,
        coverType: savingGoals.coverType,
        deadline: savingGoals.deadline,
        id: savingGoals.id,
        name: savingGoals.name,
        notes: savingGoals.notes,
        savedAmount: savingGoals.savedAmount,
        status: savingGoals.status,
        targetAmount: savingGoals.targetAmount,
        userId: savingGoals.userId,
        records: sql`COALESCE(JSON_AGG(to_jsonb(${savingRecords}) ORDER BY ${savingRecords}.id) FILTER (WHERE ${savingRecords.id} IS NOT NULL), '[]')`,
      })
      .from(savingGoals)
      .leftJoin(savingRecords, eq(savingGoals.id, savingRecords.goalId))
      .where(and(eq(savingGoals.id, goalId), eq(savingGoals.userId, userId)))
      .groupBy(savingGoals.id);

    if (!savingGoal) throw new Error("Saving goal not found");

    return { success: true, data: JSON.parse(JSON.stringify(savingGoal)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

// // Update Category data - PATCH method
export const editSavingGoal = async (
  params: EditSavingGoalParams
): Promise<ActionResponse<SavingGoal>> => {
  const validationResult = await action({
    params,
    schema: EditSavingGoalSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const savingGoalParams = validationResult.params!;
  const userId = validationResult.session?.user?.id!;

  try {
    const [editedSavingGoal] = await db
      .update(savingGoals)
      .set({
        ...(savingGoalParams && { ...savingGoalParams }),
      })
      .where(
        and(
          eq(savingGoals.id, savingGoalParams.goalId),
          eq(savingGoals.userId, userId)
        )
      )
      .returning();

    if (!editedSavingGoal) throw new Error("Failed to edit saving goal");

    revalidatePath("/saving-goals");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(editedSavingGoal)),
    };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const deleteSavingGoal = async (
  params: DeleteSavingGoalParams
): Promise<ActionResponse<SavingGoal>> => {
  const validationResult = await action({
    params,
    schema: DeleteSavingGoalSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { goalId } = validationResult.params!;
  const userId = validationResult.session?.user?.id!;

  try {
    const [savingGoal] = await db
      .delete(savingGoals)
      .where(and(eq(savingGoals.userId, userId), eq(savingGoals.id, goalId)))
      .returning({
        id: savingGoals.id,
      });

    if (!savingGoal) throw new Error("Failed to delete saving goal");

    revalidatePath("/saving-goals");
    return { success: true, data: JSON.parse(JSON.stringify(savingGoal)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

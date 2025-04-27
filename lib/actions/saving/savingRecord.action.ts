"use server";
// Database
import { db } from "@/db/drizzle";
import { and, desc, eq, sql } from "drizzle-orm";

// Schema
import {
  insertSavingRecordSchema,
  savingRecords,
  savingGoals,
} from "@/db/schemas";

// Server action & response
import action from "../../handlers/action";
import handleError from "../../handlers/error";

// Types
import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  SavingRecord,
} from "@/types/global";

// Other
import { revalidatePath } from "next/cache";
import {
  DeleteSavingRecordSchema,
  EditSavingRecordSchema,
  GetSavingRecordByIdSchema,
  PaginatedSearchParamsSchema,
} from "../../validation";

// Add Saving goal action - POST method
export const addSavingRecord = async (
  params: CreateSavingRecordParams
): Promise<ActionResponse<SavingRecord>> => {
  const validationResult = await action({
    params,
    schema: insertSavingRecordSchema.omit({
      id: true,
    }),
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { amount, notes, recordType, date, goalId } = validationResult.params!;

  try {
    const newSavingRecord = await db.transaction(async (trx) => {
      const [addSavingRecord] = await trx
        .insert(savingRecords)
        .values({ amount, notes, recordType, date, goalId })
        .returning();

      if (addSavingRecord?.goalId) {
        const amountChange = recordType === "savings" ? +amount : -amount;
        await trx
          .update(savingGoals)
          .set({
            savedAmount: sql`${savingGoals.savedAmount} + ${amountChange}`,
          })
          .where(eq(savingGoals.id, addSavingRecord?.goalId));

        return addSavingRecord;
      }
    });

    revalidatePath("/saving-goals");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newSavingRecord)),
      status: 201,
    };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const getSavingRecordById = async (
  params: GetSavingRecordByIdParams
): Promise<ActionResponse<SavingRecord>> => {
  const validationResult = await action({
    params,
    schema: GetSavingRecordByIdSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { recordId } = validationResult.params!;

  try {
    const [savingRecord] = await db
      .select()
      .from(savingRecords)
      .where(eq(savingRecords.id, recordId));

    if (!savingRecord) throw new Error("Saving record not found");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(savingRecord)),
      status: 200,
    };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const editSavingRecord = async (
  params: EditSavingRecordParams
): Promise<ActionResponse<SavingRecord>> => {
  const validationResult = await action({
    params,
    schema: EditSavingRecordSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { recordId, amount, recordType, date, notes } =
    validationResult.params!;

  try {
    const editSavingRecord = await db.transaction(async (trx) => {
      const [existingSavingRecord] = await db
        .select()
        .from(savingRecords)
        .where(and(eq(savingRecords.id, recordId)));

      let amountChanged = 0;
      if (
        existingSavingRecord.amount! < amount ||
        existingSavingRecord.amount! > amount
      ) {
        amountChanged = amount - existingSavingRecord.amount!;
      }

      const [updatedRecord] = await trx
        .update(savingRecords)
        .set({
          ...(amount && { amount }),
          ...(recordType && { recordType }),
          ...(date && { date }),
          ...(notes && { notes }),
        })
        .where(and(eq(savingRecords.id, recordId)))
        .returning();

      if (updatedRecord.goalId) {
        const [getSavingGoal] = await trx
          .select()
          .from(savingGoals)
          .where(eq(savingGoals.id, updatedRecord.goalId));

        await db
          .update(savingGoals)
          .set({
            savedAmount: getSavingGoal.savedAmount + amountChanged,
          })
          .where(eq(savingGoals.id, updatedRecord.goalId));
      }

      return updatedRecord;
    });

    if (!editSavingRecord) throw new Error("Saving record not found");

    revalidatePath("/saving-goals");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(editSavingRecord)),
      status: 200,
    };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const deleteSavingRecord = async (
  params: DeleteSavingRecordParams
): Promise<ActionResponse<SavingRecord>> => {
  const validationResult = await action({
    params,
    schema: DeleteSavingRecordSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { recordId } = validationResult.params!;
  try {
    const deleteSavingRecord = await db.transaction(async (trx) => {
      const [savingRecord] = await trx
        .delete(savingRecords)
        .where(eq(savingRecords.id, recordId))
        .returning();

      if (savingRecord.goalId) {
        const amountChange =
          savingRecord.recordType === "savings"
            ? -savingRecord.amount
            : +savingRecord.amount;
        await trx
          .update(savingGoals)
          .set({
            savedAmount: sql`${savingGoals.savedAmount} + ${amountChange}`,
          })
          .where(eq(savingGoals.id, savingRecord.goalId));
      }

      return { id: savingRecord.id };
    });

    if (!deleteSavingRecord) throw new Error("Saving record not found");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(deleteSavingRecord)),
      status: 200,
    };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

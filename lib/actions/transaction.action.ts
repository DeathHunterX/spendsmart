"use server";
// Database
import { db } from "@/db/drizzle";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";

// Schema
import {
  categories,
  insertTransactionSchema,
  transactions,
  wallets,
} from "@/db/schemas";

import {
  DeleteTransactionBulkSchema,
  DeleteTransactionByIdSchema,
  EditTransactionByIdSchema,
  GetTransactionByIdSchema,
  FilteredSearchParamsSchema,
} from "../validation";

// Server action & response
import action from "../handlers/action";
import handleError from "../handlers/error";

// Types
import {
  ActionResponse,
  ErrorResponse,
  FilteredSearchParams,
  Transaction,
} from "@/types/global";

// Other
import { parse, subDays } from "date-fns";
import { revalidatePath } from "next/cache";

export const getTransactionData = async (
  params: FilteredSearchParams
): Promise<ActionResponse<Transaction>> => {
  const validationResult = await action({
    params,
    schema: FilteredSearchParamsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { fromDate, toDate, walletId } = validationResult.params!;

  const userId = validationResult.session?.user?.id!;

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo, 30);

  const startDate = fromDate
    ? parse(fromDate, "yyyy-MM-dd", new Date())
    : defaultFrom;
  const endDate = toDate ? parse(toDate, "yyyy-MM-dd", new Date()) : defaultTo;

  try {
    /**
     * Execute in PostgreSQL formatted
     *  SELECT
     *      transactions.id as id,
     *      transactions.date as date,
     *      categories.name as category,
     *      transactions.categoryId as categoryId,
     *      transactions.payee as payee,
     *      transactions.amount as amount,
     *      transactions.notes as notes,
     *      wallets.name as wallet,
     *      transactions.walletId as walletId
     *  FROM
     *      transactions
     *  INNER JOIN
     *      wallets ON transactions.walletId = wallets.id
     *  LEFT JOIN
     *      categories ON transaction.categoryId = categories.id
     *  WHERE
     *      (walletId IS NULL OR transactions.walletId = wallets.id)
     *      AND wallet.userId = userId
     *      AND transactions.date > startDate
     *      AND transaction.date < endDate
     *  ORDER BY transactions.date DESC;
     */

    const transaction = await db
      .select({
        id: transactions.id,
        date: transactions.date,
        category: sql<string | null>`
        CASE
          WHEN ${categories.name} IS NULL AND ${categories.icon} IS NULL THEN NULL
          WHEN ${categories.name} IS NOT NULL AND ${categories.icon} IS NULL THEN ${categories.name}
          ELSE CONCAT(${categories.icon}, ' ', ${categories.name})
        END
      `,
        categoryType: categories.categoryType,
        categoryId: transactions.categoryId,
        payee: transactions.payee,
        amount: transactions.amount,
        notes: transactions.notes,
        wallet: wallets.name,
        walletId: transactions.walletId,
      })
      .from(transactions)
      .innerJoin(wallets, eq(transactions.walletId, wallets.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(
          walletId ? eq(transactions.walletId, walletId) : undefined,
          eq(wallets.userId, userId),
          gte(transactions.date, startDate),
          lte(transactions.date, endDate)
        )
      )
      .orderBy(desc(transactions.date));

    if (!transaction) throw new Error("Transaction not found");

    return { success: true, data: JSON.parse(JSON.stringify(transaction)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const getTransactionById = async (
  params: GetTransactionByIdParams
): Promise<ActionResponse<Transaction>> => {
  const validationResult = await action({
    params,
    schema: GetTransactionByIdSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { transactionId } = validationResult.params!;

  const userId = validationResult.session?.user?.id!;

  try {
    /**
     * Execute in PostgreSQL formatted
     *  SELECT
     *      transactions.id as id,
     *      transactions.date as date,
     *      transactions.categoryId as categoryId,
     *      transactions.payee as payee,
     *      transactions.amount as amount,
     *      transactions.notes as notes,
     *      transactions.walletId as walletId
     *  FROM
     *      transactions
     *  INNER JOIN
     *      wallets ON transactions.walletId = wallets.id
     *  LEFT JOIN
     *      categories ON transaction.categoryId = categories.id
     *  WHERE
     *      transactions.id = id AND wallets.userId = userId;
     */

    const [transaction] = await db
      .select({
        id: transactions.id,
        date: transactions.date,
        categoryId: transactions.categoryId,
        payee: transactions.payee,
        amount: transactions.amount,
        notes: transactions.notes,
        walletId: transactions.walletId,
      })
      .from(transactions)
      .innerJoin(wallets, eq(transactions.walletId, wallets.id))
      .leftJoin(categories, eq(transactions.categoryId, categories.id))
      .where(
        and(eq(transactions.id, transactionId), eq(wallets.userId, userId))
      );

    if (!transaction) throw new Error("Transaction not found");

    return { success: true, data: JSON.parse(JSON.stringify(transaction)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const addTransaction = async (
  params: CreateTransactionParams
): Promise<ActionResponse<Transaction>> => {
  const validationResult = await action({
    params,
    schema: insertTransactionSchema.omit({
      id: true,
    }),
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { amount, payee, notes, walletId, categoryId, date } =
    validationResult.params!;

  try {
    const transaction = await db.insert(transactions).values({
      amount,
      payee,
      notes,
      walletId,
      categoryId,
      date,
    });

    if (!transaction) throw new Error("Transaction not found");

    revalidatePath("/transactions");

    return { success: true, data: JSON.parse(JSON.stringify(transaction)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const addBulkTransactions = async (
  params: CreateTransactionParams[]
): Promise<ActionResponse<Transaction[]>> => {
  const validationResult = await action({
    params,
    schema: insertTransactionSchema
      .omit({
        id: true,
      })
      .array(),
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const transactionsToInsert = validationResult.params!.map((transaction) => ({
    amount: transaction.amount,
    payee: transaction.payee,
    notes: transaction.notes,
    walletId: transaction.walletId,
    categoryId: transaction.categoryId,
    date: transaction.date,
  }));

  try {
    const transaction = await db
      .insert(transactions)
      .values(transactionsToInsert);

    if (!transaction) throw new Error("Transactions not found");

    revalidatePath("/transactions");

    return { success: true, data: JSON.parse(JSON.stringify(transaction)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const deleteTransactionBulk = async (
  params: DeleteTransactionBulkParams
): Promise<ActionResponse<Transaction>> => {
  const validationResult = await action({
    params,
    schema: DeleteTransactionBulkSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { transactionIds } = validationResult.params!;
  const userId = validationResult.session?.user?.id!;

  try {
    /**
     * Execute in PostgreSQL formatted
     *
     *
     *
     *
     *
     *
     * */

    const transactionsToDelete = db.$with("transactions_to_delete").as(
      db
        .select({ id: transactions.id })
        .from(transactions)
        .innerJoin(wallets, eq(transactions.walletId, wallets.id))
        .where(
          and(
            inArray(transactions.id, transactionIds),
            eq(wallets.userId, userId)
          )
        )
    );

    const transaction = await db
      .with(transactionsToDelete)
      .delete(transactions)
      .where(
        inArray(transactions.id, sql`(SELECT id FROM ${transactionsToDelete})`)
      )
      .returning({
        id: transactions.id,
      });

    if (!transaction) throw new Error("Transaction not found");

    revalidatePath("/transactions");
    return { success: true, data: JSON.parse(JSON.stringify(transaction)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const editTransaction = async (
  params: EditTransactionByIdParams
): Promise<ActionResponse<Transaction>> => {
  const validationResult = await action({
    params,
    schema: EditTransactionByIdSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { transactionId, amount, payee, notes, walletId, categoryId, date } =
    validationResult.params!;
  const userId = validationResult.session?.user?.id!;

  try {
    /**
     * Execute in PostgreSQL formatted
     *
     *
     *
     *
     *
     *
     * */

    const transactionsToUpdate = db.$with("transactions_to_update").as(
      db
        .select({ id: transactions.id })
        .from(transactions)
        .innerJoin(wallets, eq(transactions.walletId, wallets.id))
        .where(
          and(eq(transactions.id, transactionId), eq(wallets.userId, userId))
        )
    );

    const transaction = await db
      .with(transactionsToUpdate)
      .update(transactions)
      .set({
        ...(amount && { amount }),
        ...(payee && { payee }),
        ...(notes && { notes }),
        ...(walletId && { walletId }),
        ...(categoryId && { categoryId }),
        ...(date && { date }),
      })
      .where(
        inArray(transactions.id, sql`(SELECT id FROM ${transactionsToUpdate})`)
      )
      .returning();

    if (!transaction) throw new Error("Transaction not found");

    revalidatePath("/transactions");
    return { success: true, data: JSON.parse(JSON.stringify(transaction)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const deleteTransaction = async (
  params: DeleteTransactionByIdParams
): Promise<ActionResponse<Transaction>> => {
  const validationResult = await action({
    params,
    schema: DeleteTransactionByIdSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { transactionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id!;

  try {
    /**
     * Execute in PostgreSQL formatted
     *
     *
     *
     *
     *
     *
     * */

    const transactionsToDelete = db.$with("transactions_to_delete").as(
      db
        .select({ id: transactions.id })
        .from(transactions)
        .innerJoin(wallets, eq(transactions.walletId, wallets.id))
        .where(
          and(
            and(eq(transactions.id, transactionId), eq(wallets.userId, userId))
          )
        )
    );

    const transaction = await db
      .with(transactionsToDelete)
      .delete(transactions)
      .where(
        inArray(transactions.id, sql`(SELECT id FROM ${transactionsToDelete})`)
      )
      .returning({
        id: transactions.id,
      });

    if (!transaction) throw new Error("Transaction not found");

    revalidatePath("/transactions");
    return { success: true, data: JSON.parse(JSON.stringify(transaction)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

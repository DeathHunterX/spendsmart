"use server";
// Database
import { db } from "@/db/drizzle";
import { and, eq, inArray } from "drizzle-orm";
// Schema
import {
  insertWalletSchema,
  selectWalletSchema,
  wallets,
} from "@/db/schemas/walletSchema";

import {
  DeleteWalletBulkSchema,
  DeleteWalletByIdSchema,
  EditWalletByIdSchema,
  GetWalletByIdSchema,
  PaginatedSearchParamsSchema,
} from "../validation";

// Server action & response
import action from "../handlers/action";
import handleError from "../handlers/error";

// Types
import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  Wallet,
} from "@/types/global";

import { revalidatePath } from "next/cache";

// Add Wallet action - POST method
export const addWallet = async (
  params: CreateWalletParams
): Promise<ActionResponse<Wallet>> => {
  const validationResult = await action({
    params,
    schema: insertWalletSchema.pick({
      name: true,
      description: true,
      initialBalance: true,
    }),
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, description, initialBalance } = validationResult.params!;
  const userId = validationResult?.session?.user?.id!;

  try {
    const [newWallet] = await db
      .insert(wallets)
      .values({
        name,
        description,
        initialBalance,
        userId,
      })
      .returning();

    if (!newWallet) {
      throw new Error("Failed to create wallet");
    }

    revalidatePath("/wallets");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newWallet)),
      status: 201,
    };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

// Get Wallets action - GET method
export const getWalletData = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<Wallet>> => {
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
    const wallet = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId));

    if (!wallet) throw new Error("Wallet not found");

    return { success: true, data: JSON.parse(JSON.stringify(wallet)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const deleteWalletBulk = async (
  params: DeleteWalletBulkParams
): Promise<ActionResponse<Wallet>> => {
  const validationResult = await action({
    params,
    schema: DeleteWalletBulkSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { ids } = validationResult.params!;
  const userId = validationResult.session?.user?.id!;

  try {
    const wallet = await db
      .delete(wallets)
      .where(and(eq(wallets.userId, userId), inArray(wallets.id, ids)))
      .returning({
        id: wallets.id,
      });

    if (!wallet) throw new Error("Wallet not found");

    revalidatePath("/wallets");
    return { success: true, data: JSON.parse(JSON.stringify(wallet)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const getWalletById = async (
  params: GetWalletByIdParams
): Promise<ActionResponse<Wallet>> => {
  const validationResult = await action({
    params,
    schema: GetWalletByIdSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { id } = validationResult.params!;
  const userId = validationResult.session?.user?.id!;

  try {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(and(eq(wallets.id, id), eq(wallets.userId, userId)));

    if (!wallet) throw new Error("Wallet not found");

    return { success: true, data: JSON.parse(JSON.stringify(wallet)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

// Update Wallet data - PATCH method
export const editWallet = async (
  params: EditWalletByIdParams
): Promise<ActionResponse<Wallet>> => {
  const validationResult = await action({
    params,
    schema: EditWalletByIdSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { walletId, name, description, initialBalance } =
    validationResult.params!;
  const userId = validationResult.session?.user?.id!;

  try {
    const wallet = await db
      .update(wallets)
      .set({
        ...(name && { name }),
        ...(description && { description }),
        ...(initialBalance && { initialBalance }),
      })
      .where(and(eq(wallets.id, walletId), eq(wallets.userId, userId)))
      .returning();

    if (!wallet) throw new Error("Wallet not found");

    revalidatePath("/wallets");
    return { success: true, data: JSON.parse(JSON.stringify(wallet)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const deleteWallet = async (
  params: DeleteWalletByIdParams
): Promise<ActionResponse<Wallet>> => {
  const validationResult = await action({
    params,
    schema: DeleteWalletByIdSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { walletId } = validationResult.params!;
  const userId = validationResult.session?.user?.id!;

  try {
    const wallet = await db
      .delete(wallets)
      .where(and(eq(wallets.userId, userId), eq(wallets.id, walletId)))
      .returning({
        id: wallets.id,
      });

    if (!wallet) throw new Error("Wallet not found");

    revalidatePath("/wallets");
    return { success: true, data: JSON.parse(JSON.stringify(wallet)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

"use server";
// Database
import { db } from "@/db/drizzle";
import { and, eq, inArray } from "drizzle-orm";
// Schema
import {
  categories,
  insertCategorySchema,
  selectCategorySchema,
} from "@/db/schemas/category.schema";

import {
  DeleteCategoryBulkSchema,
  DeleteCategoryByIdSchema,
  EditCategoryByIdSchema,
  GetCategoryByIdSchema,
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
  Category,
} from "@/types/global";

// Other
import { revalidatePath } from "next/cache";

// Add Category action - POST method
export const addCategory = async (
  params: CreateCategoryParams
): Promise<ActionResponse<Category>> => {
  const validationResult = await action({
    params,
    schema: insertCategorySchema.pick({
      name: true,
      type: true,
      icon: true,
    }),
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, type, icon } = validationResult.params!;
  const userId = validationResult?.session?.user?.id!;

  try {
    const [newCategory] = await db
      .insert(categories)
      .values({
        name,
        type,
        icon,
        userId,
      })
      .returning();

    if (!newCategory) {
      throw new Error("Failed to create category");
    }

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newCategory)),
      status: 201,
    };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

// Get Categories action - GET method
export const getCategoryData = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<Category>> => {
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
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.userId, userId));

    if (!category) throw new Error("Category not found");

    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const deleteCategoryBulk = async (
  params: DeleteCategoryBulkParams
): Promise<ActionResponse<Category>> => {
  const validationResult = await action({
    params,
    schema: DeleteCategoryBulkSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { ids } = validationResult.params!;
  const userId = validationResult.session?.user?.id!;

  try {
    const category = await db
      .delete(categories)
      .where(and(eq(categories.userId, userId), inArray(categories.id, ids)))
      .returning({
        id: categories.id,
      });

    if (!category) throw new Error("Category not found");

    revalidatePath("/categories");
    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const getCategoryById = async (
  params: GetCategoryByIdParams
): Promise<ActionResponse<Category>> => {
  const validationResult = await action({
    params,
    schema: GetCategoryByIdSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { id } = validationResult.params!;
  const userId = validationResult.session?.user?.id!;
  try {
    const [category] = await db
      .select()
      .from(categories)
      .where(and(eq(categories.id, id), eq(categories.userId, userId)));

    if (!category) throw new Error("Category not found");

    revalidatePath("/categories");
    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

// Update Category data - PATCH method
export const editCategory = async (
  params: EditCategoryByIdParams
): Promise<ActionResponse<Category>> => {
  const validationResult = await action({
    params,
    schema: EditCategoryByIdSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { categoryId, name, type, icon } = validationResult.params!;
  const userId = validationResult.session?.user?.id!;

  try {
    const category = await db
      .update(categories)
      .set({
        ...(name && { name }),
        ...(type && { type }),
        ...(icon && { icon }),
      })
      .where(and(eq(categories.id, categoryId), eq(categories.userId, userId)))
      .returning();

    if (!category) throw new Error("Category not found");

    revalidatePath("/categories");
    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

export const deleteCategory = async (
  params: DeleteCategoryByIdParams
): Promise<ActionResponse<Category>> => {
  const validationResult = await action({
    params,
    schema: DeleteCategoryByIdSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { categoryId } = validationResult.params!;
  const userId = validationResult.session?.user?.id!;

  try {
    const category = await db
      .delete(categories)
      .where(and(eq(categories.userId, userId), eq(categories.id, categoryId)))
      .returning({
        id: categories.id,
      });

    if (!category) throw new Error("Category not found");

    revalidatePath("/category");
    return { success: true, data: JSON.parse(JSON.stringify(category)) };
  } catch (error) {
    return handleError(error, "api") as ErrorResponse;
  }
};

import { z } from "zod";

export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long. " })
    .max(100, { message: "Password cannot exceed 100 characters." }),
});

export const SignUpSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required." })
    .max(50, { message: "Name cannot exceed 50 characters." })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces.",
    }),

  email: z
    .string()
    .min(1, { message: "Email is required." })
    .email({ message: "Please provide a valid email address." }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    }),
});

export const FilteredSearchParamsSchema = z.object({
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  walletId: z.string().optional(),
});

/**
 * ===============================================================================
 * Wallet Schema
 * ===============================================================================
 */
export const CreateWalletSchema = z.object({
  name: z.string().min(1, { message: "Wallet name is required." }),
  description: z.string().optional(),
  initialBalance: z
    .string()
    .min(1, { message: "Initial balance is required." }),
});

export const GetWalletByIdSchema = z.object({
  id: z.string(),
});

export const EditWalletByIdSchema = CreateWalletSchema.extend({
  walletId: z.string().min(1, { message: "Wallet ID is required." }),
});

export const DeleteWalletBulkSchema = z.object({
  ids: z.array(z.string()),
});

export const DeleteWalletByIdSchema = z.object({
  walletId: z.string(),
});

/**
 * ===============================================================================
 * Category Schema
 * ===============================================================================
 */

export const CreateCategorySchema = z.object({
  name: z.string().min(1, { message: "Wallet name is required." }),
  type: z.enum(["income", "expense"]),
  icon: z.string(),
});

export const GetCategoryByIdSchema = z.object({
  id: z.string(),
});

export const EditCategoryByIdSchema = CreateCategorySchema.extend({
  categoryId: z.string().min(1, { message: "Category ID is required." }),
});

export const DeleteCategoryBulkSchema = z.object({
  ids: z.array(z.string()),
});

export const DeleteCategoryByIdSchema = z.object({
  categoryId: z.string(),
});

export const PaginatedSearchParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().default(10),
  query: z.string().optional(),
  filter: z.string().optional(),
  sort: z.string().optional(),
});

/**
 * ===============================================================================
 * Transaction Schema
 * ===============================================================================
 */

export const GetTransactionByIdSchema = z.object({
  transactionId: z.string(),
});

export const CreateTransactionSchema = z.object({
  amount: z.coerce.number(),
  payee: z.string().min(1, { message: "Wallet name is required." }),
  notes: z.string().nullable().optional(),
  date: z.coerce.date(),
  walletId: z.string(),
  categoryId: z.string().nullable().optional(),
});

export const EditTransactionByIdSchema = CreateTransactionSchema.extend({
  transactionId: z.string().min(1, "Transaction ID is required"),
});

export const DeleteTransactionByIdSchema = z.object({
  transactionId: z.string(),
});

export const DeleteTransactionBulkSchema = z.object({
  transactionIds: z.array(z.string()),
});

/**
 * ===============================================================================
 * Saving Goal Schema
 * ===============================================================================
 */

export const CreateSavingGoalSchema = z.object({
  coverType: z.enum(["icon", "photo"], {
    message: "Only icon and photo type are required",
  }),
  coverImg: z.string(),
  name: z.string().min(1, { message: "Name is required" }),
  notes: z.string().optional(),
  targetAmount: z.number().gte(0, { message: "Amount is required" }),
  deadline: z.coerce.date({ message: "Deadline is required" }),
  status: z.enum(["active", "completed", "cancelled"], {
    message: "Only active, completed and cancelled type are required",
  }),
});

export const GetSavingGoalByIdSchema = z.object({
  goalId: z.string(),
});

export const EditSavingGoalSchema = CreateSavingGoalSchema.extend({
  goalId: z.string(),
});

export const DeleteSavingGoalSchema = z.object({
  goalId: z.string(),
});

/**
 * ===============================================================================
 * Saving Record Schema
 * ===============================================================================
 */

export const CreateSavingRecordSchema = z.object({
  amount: z.number().gt(0, { message: "Amount is required" }),
  recordType: z.enum(["savings", "withdrawals"], {
    message: "Savings or Withdrawals type only",
  }),
  date: z.coerce.date({ message: "Date is required" }),
  notes: z.string(),
  // goalId: z.string().min(10, { message: "Goal Id is required" }),
});

export const GetSavingRecordByIdSchema = z.object({
  recordId: z.string(),
});

export const EditSavingRecordSchema = CreateSavingRecordSchema.extend({
  recordId: z.string(),
});

export const DeleteSavingRecordSchema = z.object({
  recordId: z.string(),
});

/**
 * ===============================================================================
 * Budget Schema
 * ===============================================================================
 */

export const CreateBudgetSchema = z.object({
  walletId: z.string(),
  categoryId: z.string(),
  period: z.enum(["day", "week", "month", "quarter", "year", "overtime"]),
  amount: z.number(),
});

export const EditBudgetSchema = CreateBudgetSchema.extend({
  budgetId: z.string(),
});

export const DeleteBudgetSchema = z.object({
  budgetId: z.string(),
});

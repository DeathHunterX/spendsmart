interface AuthCredentials {
  name: string;
  email: string;
  password: string;
}

// *
// * ===============================================================================
// * Wallet Params
// * ===============================================================================
// *

interface CreateWalletParams {
  name: string;
  description?: string;
  initialBalance: string;
}

interface GetWalletsByUserParams {
  userId: string;
}

interface GetWalletByIdParams {
  id: string;
}

interface EditWalletByIdParams extends CreateWalletParams {
  walletId: string;
}

interface DeleteWalletBulkParams {
  ids: string[];
}

interface DeleteWalletByIdParams {
  walletId: string;
}

// *
// * ===============================================================================
// * Category Params
// * ===============================================================================
// *

interface CreateCategoryParams {
  name: string;
  type: "income" | "expense";
  icon: string;
}

interface GetCategoriesByUserParams {
  userId: string;
}

interface GetCategoryByIdParams {
  id: string;
}

interface EditCategoryByIdParams extends CreateCategoryParams {
  categoryId: string;
}

interface DeleteCategoryBulkParams {
  ids: string[];
}

interface DeleteCategoryByIdParams {
  categoryId: string;
}

// *
// * ===============================================================================
// * Transaction Params
// * ===============================================================================
// *

interface CreateTransactionParams {
  amount: number;
  payee: string;
  notes?: string | null;
  date: Date;
  walletId: string;
  categoryId?: string | null;
}

interface GetTransactionByIdParams {
  transactionId: string;
}

interface EditTransactionByIdParams extends CreateTransactionParams {
  transactionId: string;
}

interface DeleteTransactionBulkParams {
  transactionIds: string[];
}

interface DeleteTransactionByIdParams {
  transactionId: string;
}

// *
// * ===============================================================================
// * Saving Goal Params
// * ===============================================================================
// *

interface CreateSavingGoalParams {
  coverType: "icon" | "photo";
  coverImg: string;
  name: string;
  notes?: string;
  targetAmount: number;
  deadline: Date;
  status: "active" | "completed" | "cancelled";
}

interface GetSavingGoalByIdParams {
  goalId: string;
}

interface EditSavingGoalParams extends CreateSavingGoalParams {
  goalId: string;
}

interface DeleteSavingGoalParams {
  goalId: string;
}

// *
// * ===============================================================================
// * Saving Record Params
// * ===============================================================================
// *

interface CreateSavingRecordParams {
  amount: number;
  recordType: "savings" | "withdrawals";
  date: Date;
  notes: string;
  goalId: string;
}

interface GetSavingRecordByIdParams {
  recordId: string;
}

interface EditSavingRecordParams extends CreateSavingRecordParams {
  recordId: string;
}

interface DeleteSavingRecordParams {
  recordId: string;
}

// *
// * ===============================================================================
// * Budget Params
// * ===============================================================================
// *

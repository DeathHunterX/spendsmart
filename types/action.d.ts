interface AuthCredentials {
  name: string;
  email: string;
  password: string;
}

/**
 * ===============================================================================
 * Wallet Params
 * ===============================================================================
 */

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

/**
 * ===============================================================================
 * Category Params
 * ===============================================================================
 */

interface CreateCategoryParams {
  name: string;
  description?: string;
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

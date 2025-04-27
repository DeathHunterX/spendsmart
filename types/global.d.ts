import { NextResponse } from "next/server";

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: string | null;
  image: string | null;
}

interface Account {
  userId: string;
  type?: string;
  provider: string;
  providerAccountId: string;
  password: string;
  refresh_token: string;
  access_token: string;
  expires_at: number;
  token_type: string;
  scope: string;
  id_token: string;
  session_state: string;
}

interface Wallet {
  id: string;
  name: string;
  description: string;
  initialBalance: string;
  userId: string;
}

interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  icon?: string;
  userId: string;
}

interface Transaction {
  id: string;
  amount: number;
  payee: string;
  notes?: string | null;
  date: Date;
  walletId: string;
  categoryId?: string | null;
  category?: string | null;
  wallet?: string | null;
}

interface SavingGoal {
  id: string;
  coverType: "icon" | "photo";
  coverImg: string;
  name: string;
  notes?: string;
  savedAmount: number;
  targetAmount: number;
  deadline: Date;
  status: "active" | "completed" | "cancelled";
  userId: string;
  records?: SavingRecord[];
}

interface SavingRecord {
  id: string;
  amount: number;
  recordType: "savings" | "withdrawals";
  date: Date;
  notes: string;
  goalId: string;
}

interface Budget {
  id: string;
  walletId: string;
  categoryId: string;
  period: "day" | "week" | "month" | "quarter" | "year" | "overtime";
  amount: number;
}

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

export type SuccessResponse<T = null> = ActionResponse<T> & { success: true };
export type ErrorResponse = ActionResponse<undefined> & { success: false };

export type APIErrorResponse = NextResponse<ErrorResponse>;
export type APIResponse<T = null> = NextResponse<
  SuccessResponse<T> | ErrorResponse
>;

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface FilteredSearchParams {
  fromDate?: string;
  toDate?: string;
  walletId?: string;
}

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}

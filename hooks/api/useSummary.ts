import { getSummaryData } from "@/lib/actions/summary.action";
import { RequestError } from "@/lib/http-error";
import { convertAmountFromMiliUnits } from "@/lib/utils";
import { Transaction } from "@/types/global";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useGetSummary = () => {
  const params = useSearchParams();
  const fromDate = params.get("fromDate") || "";
  const toDate = params.get("toDate") || "";
  const walletId = params.get("walletId") || "";

  const query = useQuery({
    queryKey: ["summary", { fromDate, toDate, walletId }],
    queryFn: async () => {
      const response = await getSummaryData({ fromDate, toDate, walletId });

      if (!response.success) {
        const status = response?.status ?? 500;

        throw new RequestError(status, `HTTP error: ${status}`);
      }

      return {
        ...response.data,
        incomeAmount: convertAmountFromMiliUnits(response.data.incomeAmount),
        expenseAmount: convertAmountFromMiliUnits(response.data.expenseAmount),
        remainingAmount: convertAmountFromMiliUnits(
          response.data.remainingAmount
        ),
        categories: response.data.categories.map(
          (category: { name: string; value: number }) => ({
            ...category,
            value: convertAmountFromMiliUnits(category.value),
          })
        ),
        days: response.data.days.map(
          (day: { date: string | Date; income: number; expense: number }) => ({
            ...day,
            income: convertAmountFromMiliUnits(day.income),
            expense: convertAmountFromMiliUnits(day.expense),
          })
        ),
        transactionHistory: response.data.transactionHistory.map(
          (data: Transaction) => ({
            ...data,
            amount: convertAmountFromMiliUnits(data.amount),
          })
        ),
        top4SavingGoals: response.data?.top4SavingGoals.map((data: any) => ({
          ...data,
          savedAmount: convertAmountFromMiliUnits(data.savedAmount),
          targetAmount: convertAmountFromMiliUnits(data.targetAmount),
        })),
        walletData: response.data.walletData.map((data: any) => ({
          ...data,
          balance: convertAmountFromMiliUnits(data.balance),
        })),
      };
    },
  });

  return query;
};

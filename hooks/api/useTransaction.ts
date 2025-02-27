import {
  addBulkTransactions,
  addTransaction,
  deleteTransaction,
  deleteTransactionBulk,
  editTransaction,
  getTransactionById,
  getTransactionData,
} from "@/lib/actions/transaction.action";
import { RequestError } from "@/lib/http-error";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { useSearchParams } from "next/navigation";
import { toast } from "../use-toast";
import { Transaction } from "@/types/global";
import { convertAmountFromMiliunits } from "@/lib/utils";

// Get transaction data hooks
export const useGetTransactions = () => {
  const query = useQuery({
    // TODO: Check if params are needed in the key

    queryKey: ["transactions"],
    queryFn: async () => {
      const response = await getTransactionData({});

      if (!response.success) {
        const status = response?.status ?? 500;

        throw new RequestError(status, `HTTP error: ${status}`);
      }
      const transformData = (data: Transaction) => {
        // Apply the transformation logic (customize as needed)
        return {
          ...data,
          amount: convertAmountFromMiliunits(data?.amount),
        };
      };

      if (Array.isArray(response.data)) {
        // If data is already an array, map and transform each item
        return response.data.map((item) => transformData(item));
      } else if (response.data) {
        // If data is not an array, wrap it in an array and transform
        return [transformData(response.data)];
      } else {
        // If data is null or undefined, return an empty array
        return [];
      }
    },
  });

  return query;
};

// Get wallet data by id hook
export const useGetTransactionById = (
  id: string,
  options?: { enabled?: boolean }
) => {
  const query = useQuery({
    enabled: options?.enabled ?? !!id,
    queryKey: ["transaction", { id }],
    queryFn: async () => {
      const response = await getTransactionById({ transactionId: id });

      if (!response.success) {
        const status = response?.status ?? 500;

        throw new RequestError(status, `HTTP error: ${status}`);
      }

      const transformData = (data: Transaction) => {
        // Apply the transformation logic (customize as needed)
        return {
          ...data,
          amount: convertAmountFromMiliunits(data.amount),
        };
      };

      if (response.data) {
        return transformData(response.data);
      } else {
        // If data is null or undefined, return an empty array
        return {};
      }
    },
  });
  return query;
};

// Create transaction hooks
export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateTransactionParams) => {
      const response = await addTransaction(data);

      if (!response.success) {
        // Throw an error if the response indicates failure
        const status = response?.status ?? 500;
        const message = response?.error?.message || "Something went wrong";
        throw new Error(`${status}: ${message}`);
      }

      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: any) => {
      const [status, errorMessage] = error.message.split(":");
      toast({
        title: `Error ${status}`,
        description: errorMessage || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  return mutation;
};

// Create bulk transaction hooks
export const useCreateBulkTransactions = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateTransactionParams[]) => {
      const response = await addBulkTransactions(data);

      if (!response.success) {
        // Throw an error if the response indicates failure
        const status = response?.status ?? 500;
        const message = response?.error?.message || "Something went wrong";
        throw new Error(`${status}: ${message}`);
      }

      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transactions created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: any) => {
      const [status, errorMessage] = error.message.split(":");
      toast({
        title: `Error ${status}`,
        description: errorMessage || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  return mutation;
};

// Update a wallet hook
export const useEditTransaction = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: EditTransactionByIdParams) => {
      const response = await editTransaction(data);

      if (!response.success) {
        // Throw an error if the response indicates failure
        const status = response?.status ?? 500;
        const message = response?.error?.message || "Something went wrong";
        throw new Error(`${status}: ${message}`);
      }

      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: any) => {
      const [status, errorMessage] = error.message.split(":");
      toast({
        title: `Error ${status}`,
        description:
          errorMessage || "Something went wrong while editing category!",
        variant: "destructive",
      });
    },
  });

  return mutation;
};

// Delete a transaction hook
export const useDeleteTransaction = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await deleteTransaction({ transactionId: id });

      if (!response.success) {
        // Throw an error if the response indicates failure
        const status = response?.status ?? 500;
        const message = response?.error?.message;
        throw new Error(`${status}: ${message}`);
      }

      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: any) => {
      const [status, errorMessage] = error.message.split(":");
      toast({
        title: `Error ${status}`,
        description:
          errorMessage || "Something went wrong while deleting transaction!",
        variant: "destructive",
      });
    },
  });
  return mutation;
};

// Delete transaction bulk hook
export const useBulkDeleteTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await deleteTransactionBulk({ transactionIds: ids });

      if (!response.success) {
        // Throw an error if the response indicates failure
        const status = response?.status ?? 500;
        const message = response?.error?.message;
        throw new Error(`${status}: ${message}`);
      }

      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "All selected transactions deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: any) => {
      const [status, errorMessage] = error.message.split(":");
      toast({
        title: `Error ${status}`,
        description:
          errorMessage ||
          "Something went wrong while deleting selected transactions!",
        variant: "destructive",
      });
    },
  });
  return mutation;
};

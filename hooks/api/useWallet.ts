import {
  addWallet,
  deleteWallet,
  deleteWalletBulk,
  editWallet,
  getWalletById,
  getWalletData,
} from "@/lib/actions/wallet.action";
import { RequestError } from "@/lib/http-error";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "../use-toast";

// Get all wallet data hook
export const useGetWallets = () => {
  const query = useQuery({
    queryKey: ["wallets"],
    queryFn: async () => {
      const response = await getWalletData({});

      if (!response.success) {
        const status = response?.status ?? 500;

        throw new RequestError(status, `HTTP error: ${status}`);
      }

      return Array.isArray(response.data)
        ? response.data
        : response.data
          ? [response.data]
          : [];
    },
  });
  return query;
};

// Get wallet data by id hook
export const useGetWalletById = (
  id: string,
  options?: { enabled?: boolean }
) => {
  const query = useQuery({
    enabled: options?.enabled ?? !!id,
    queryKey: ["wallet", { id }],
    queryFn: async () => {
      const response = await getWalletById({ id: id });

      if (!response.success) {
        const status = response?.status ?? 500;

        throw new RequestError(status, `HTTP error: ${status}`);
      }

      return response.data;
    },
  });
  return query;
};

// Create a wallet hook
export const useCreateWallet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateWalletParams) => {
      const response = await addWallet(data);

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
        description: "Wallet created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: any) => {
      const [status, errorMessage] = error.message.split(":");
      toast({
        title: `Error ${status}`,
        description:
          errorMessage || "Something went wrong while creating wallet!",
        variant: "destructive",
      });
    },
  });
  return mutation;
};

// Update a wallet hook
export const useEditWallet = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: EditWalletByIdParams) => {
      const response = await editWallet(data);

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
        description: "Wallet updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["wallet", { id }] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
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

// Delete a wallet hook
export const useDeleteWallet = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const response = await deleteWallet({ walletId: id });

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
        description: "Wallet deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: any) => {
      const [status, errorMessage] = error.message.split(":");
      toast({
        title: `Error ${status}`,
        description:
          errorMessage || "Something went wrong while deleting wallet!",
        variant: "destructive",
      });
    },
  });
  return mutation;
};

// Delete wallet bulk hook
export const useBulkDeleteWallet = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await deleteWalletBulk({ ids });

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
        description: "All selected wallets deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: any) => {
      const [status, errorMessage] = error.message.split(":");
      toast({
        title: `Error ${status}`,
        description:
          errorMessage || "Something went wrong while deleting wallet!",
        variant: "destructive",
      });
    },
  });
  return mutation;
};

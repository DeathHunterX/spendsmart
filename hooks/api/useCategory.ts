import { RequestError } from "@/lib/http-error";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "../use-toast";
import {
  addCategory,
  deleteCategory,
  deleteCategoryBulk,
  editCategory,
  getCategoryById,
  getCategoryData,
} from "@/lib/actions/category.action";

// Get all wallet data hook
export const useGetCategories = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await getCategoryData({});

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
export const useGetCategoryById = (
  id: string,
  options?: { enabled?: boolean }
) => {
  const query = useQuery({
    enabled: options?.enabled ?? !!id,
    queryKey: ["category", { id }],
    queryFn: async () => {
      const response = await getCategoryById({ id: id });

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
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateCategoryParams) => {
      const response = await addCategory(data);

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
        description: "Category created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: any) => {
      const [status, errorMessage] = error.message.split(":");
      toast({
        title: `Error ${status}`,
        description:
          errorMessage || "Something went wrong while creating category!",
        variant: "destructive",
      });
    },
  });
  return mutation;
};

// Update a wallet hook
export const useEditCategory = (id: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: EditCategoryByIdParams) => {
      const response = await editCategory(data);

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
      queryClient.invalidateQueries({ queryKey: ["category", { id }] });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
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

// Delete a wallet hook
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteCategory({ categoryId: id });

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
        description: "Category deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
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
export const useDeleteBulkCategory = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await deleteCategoryBulk({ ids });

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
        description: "All selected categories deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: any) => {
      const [status, errorMessage] = error.message.split(":");
      toast({
        title: `Error ${status}`,
        description:
          errorMessage ||
          "Something went wrong while deleting selected categories!",
        variant: "destructive",
      });
    },
  });
  return mutation;
};

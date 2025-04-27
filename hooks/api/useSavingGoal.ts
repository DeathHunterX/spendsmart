import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "../use-toast";

// Actions
import {
  addSavingGoal,
  deleteSavingGoal,
  editSavingGoal,
  getSavingGoalById,
  getSavingGoalData,
} from "@/lib/actions/saving/savingGoal.action";

// Error
import { RequestError } from "@/lib/http-error";
import { convertAmountFromMiliUnits } from "@/lib/utils";
import { SavingGoal } from "@/types/global";

// Get all saving goals data hook
export const useGetSavingGoals = () => {
  const query = useQuery({
    queryKey: ["saving-goals"],
    queryFn: async () => {
      const response = await getSavingGoalData({});

      if (!response.success) {
        const status = response?.status ?? 500;

        throw new RequestError(status, `HTTP error: ${status}`);
      }

      const transformData = (data: SavingGoal) => {
        // Apply the transformation logic (customize as needed)
        return {
          ...data,
          savedAmount: convertAmountFromMiliUnits(data?.savedAmount),
          targetAmount: convertAmountFromMiliUnits(data?.targetAmount),
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

// Get saving goal by id hook
export const useGetSavingGoalById = (
  id: string,
  options?: { enabled?: boolean }
) => {
  const query = useQuery({
    enabled: options?.enabled ?? !!id,
    queryKey: ["saving-goal", { id }],
    queryFn: async () => {
      const response = await getSavingGoalById({ goalId: id });

      if (!response.success) {
        const status = response?.status ?? 500;
        throw new RequestError(status, `HTTP error: ${status}`);
      }

      const transformData = (data: SavingGoal) => {
        // Apply transformation logic (customize as needed)
        return {
          ...data,
          savedAmount: convertAmountFromMiliUnits(data?.savedAmount),
          targetAmount: convertAmountFromMiliUnits(data?.targetAmount),
          records: data?.records?.map((record) => ({
            ...record,
            amount: convertAmountFromMiliUnits(record?.amount),
          })),
        };
      };

      if (response.data) {
        return transformData(response.data);
      } else {
        return undefined;
      }
    },
  });

  return query;
};

// Create a saving goal hook
export const useCreateSavingGoal = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateSavingGoalParams) => {
      const response = await addSavingGoal(data);

      if (!response.success) {
        // Throw an error if the response indicates failure
        const status = response?.status ?? 500;
        const message = response?.error?.message || "Something went wrong";
        throw new Error(`${status}: ${message}`);
      }

      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Saving goal created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["saving-goals"] });
      queryClient.invalidateQueries({
        queryKey: ["saving-goal", { id: data?.id }],
      });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: any) => {
      const [status, errorMessage] = error.message.split(":");
      toast({
        title: `Error ${status}`,
        description:
          errorMessage || "Something went wrong while creating a saving goal!",
        variant: "destructive",
      });
    },
  });
  return mutation;
};

export const useEditSavingGoal = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: EditSavingGoalParams) => {
      const response = await editSavingGoal(data);

      if (!response.success) {
        // Throw an error if the response indicates failure
        const status = response?.status ?? 500;
        const message = response?.error?.message || "Something went wrong";
        throw new Error(`${status}: ${message}`);
      }

      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Saving goal deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["saving-goals"] });
      queryClient.invalidateQueries({
        queryKey: ["saving-goal", { id: data?.id }],
      });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: any) => {
      const [status, errorMessage] = error.message.split(":");
      toast({
        title: `Error ${status}`,
        description:
          errorMessage || "Something went wrong while editing saving record!",
        variant: "destructive",
      });
    },
  });

  return mutation;
};

export const useDeleteSavingGoal = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (goalId: string) => {
      const response = await deleteSavingGoal({ goalId });

      if (!response.success) {
        // Throw an error if the response indicates failure
        const status = response?.status ?? 500;
        const message = response?.error?.message;
        throw new Error(`${status}: ${message}`);
      }

      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);
      toast({
        title: "Success",
        description: "Saving goal deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["saving-goals"] });
      queryClient.invalidateQueries({
        queryKey: ["saving-goal", { id: data?.id }],
      });
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: any) => {
      const [status, errorMessage] = error.message.split(":");
      toast({
        title: `Error ${status}`,
        description:
          errorMessage || "Something went wrong while deleting saving goal!",
        variant: "destructive",
      });
    },
  });
  return mutation;
};

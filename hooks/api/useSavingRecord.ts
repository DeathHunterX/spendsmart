import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "../use-toast";

// Actions
import {
  addSavingRecord,
  deleteSavingRecord,
  editSavingRecord,
  getSavingRecordById,
} from "@/lib/actions/saving/savingRecord.action";

// Error
import { RequestError } from "@/lib/http-error";
import { convertAmountFromMiliUnits } from "@/lib/utils";
import { SavingGoal, SavingRecord } from "@/types/global";

// Get all saving goals data hook

// Get saving goal by id hook
export const useGetSavingRecordById = (
  id: string,
  options?: { enabled?: boolean }
) => {
  const query = useQuery({
    enabled: options?.enabled ?? !!id,
    queryKey: ["saving-record", { id }],
    queryFn: async () => {
      const response = await getSavingRecordById({ recordId: id });

      if (!response.success) {
        const status = response?.status ?? 500;
        throw new RequestError(status, `HTTP error: ${status}`);
      }

      const transformData = (data: SavingRecord) => {
        // Apply the transformation logic (customize as needed)
        return {
          ...data,
          amount: convertAmountFromMiliUnits(data?.amount),
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
export const useCreateSavingRecord = (savingGoalId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: CreateSavingRecordParams) => {
      const response = await addSavingRecord(data);

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
        description: "Saving record created successfully",
      });

      queryClient.invalidateQueries({ queryKey: ["saving-goals"] });
      queryClient.invalidateQueries({
        queryKey: ["saving-goal", { id: savingGoalId }],
      });

      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: any) => {
      const [status, errorMessage] = error.message.split(":");
      toast({
        title: `Error ${status}`,
        description:
          errorMessage ||
          "Something went wrong while creating a saving record!",
        variant: "destructive",
      });
    },
  });
  return mutation;
};

// Update a saving record hook
export const useEditSavingRecord = (savingGoalId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: EditSavingRecordParams) => {
      const response = await editSavingRecord(data);

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
        description: "Saving record updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["saving-goals"] });
      queryClient.invalidateQueries({
        queryKey: ["saving-goal", { id: savingGoalId }],
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

export const useDeleteSavingRecord = (savingGoalId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (recordId: string) => {
      const response = await deleteSavingRecord({ recordId });

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
        description: "Saving record deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["saving-goals"] });
      queryClient.invalidateQueries({
        queryKey: ["saving-goal", { id: savingGoalId }],
      });

      queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: (error: any) => {
      const [status, errorMessage] = error.message.split(":");
      toast({
        title: `Error ${status}`,
        description:
          errorMessage || "Something went wrong while deleting saving record!",
        variant: "destructive",
      });
    },
  });
  return mutation;
};

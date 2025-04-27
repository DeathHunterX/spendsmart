"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Form } from "@/components/ui/form";

import { CreateSavingRecordSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import InputField from "./input/InputField";
import DatePickerField from "./input/DatePickerField";
import TextAreaField from "./input/TextareaField";
import { convertAmountToMiliunits } from "@/lib/utils";
import {
  useCreateSavingRecord,
  useEditSavingRecord,
} from "@/hooks/api/useSavingRecord";

import { savingRecordModalStore } from "@/stores";
import { useEffect } from "react";

interface SavingRecordFormProps {
  savingGoalId: string;
}

const SavingRecordForm = ({ savingGoalId }: SavingRecordFormProps) => {
  const { isModalOpen, data, handleClose, formType, actionType } =
    savingRecordModalStore();

  const createSavingRecordMutation = useCreateSavingRecord(savingGoalId);
  const editSavingRecordMutation = useEditSavingRecord(savingGoalId);

  const form = useForm<z.infer<typeof CreateSavingRecordSchema>>({
    resolver: zodResolver(CreateSavingRecordSchema),
    defaultValues: {
      amount: formType === "update" ? data?.amount || 100 : 0,
      recordType:
        formType === "update" ? data?.recordType || actionType : actionType,
      date: formType === "update" ? data?.date || new Date() : new Date(),
      notes: formType === "update" ? data?.notes || "" : "",
    },
  });

  // Reset form values when data or formType changes
  useEffect(() => {
    if (isModalOpen) {
      // Only reset form values when the modal is open
      form.reset({
        amount: formType === "update" && data ? data?.amount || 100 : 0,
        recordType:
          formType === "update" && data
            ? data?.recordType || actionType
            : actionType,
        date:
          formType === "update" && data?.date
            ? new Date(data.date)
            : new Date(),
        notes: formType === "update" && data ? data?.notes || "" : "",
      });
    }
  }, [isModalOpen, data, formType, actionType, form]);

  const isPending =
    createSavingRecordMutation.isPending || editSavingRecordMutation.isPending;

  const onSubmit = async (values: z.infer<typeof CreateSavingRecordSchema>) => {
    const amountInMiliunits = convertAmountToMiliunits(values.amount);

    const dateFormatted = new Date(
      Date.UTC(
        values.date.getFullYear(),
        values.date.getMonth(),
        values.date.getDate(),
        0,
        0,
        0
      )
    );

    if (formType === "update" && savingGoalId) {
      editSavingRecordMutation.mutate(
        {
          ...values,
          amount: amountInMiliunits,
          date: dateFormatted,
          recordType: actionType,
          goalId: savingGoalId,
          recordId: data?.id || "",
        },
        { onSuccess: handleClose }
      );
    } else {
      createSavingRecordMutation.mutate(
        {
          ...values,
          amount: amountInMiliunits,
          date: dateFormatted,
          recordType: actionType,
          goalId: savingGoalId,
        },
        { onSuccess: handleClose }
      );
    }
  };

  const buttonText = !(formType === "update")
    ? actionType === "savings"
      ? "Add"
      : "Withdraw"
    : "Save changes";

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {formType === "update"
              ? `Edit ${actionType === "savings" ? "Saving" : "Withdrawal"}`
              : actionType === "savings"
                ? "Add Saving"
                : "Withdraw Money"}
          </DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputField nameInSchema="amount" label="Amount" type="number" />
            <DatePickerField nameInSchema="date" label="Date" />
            <TextAreaField nameInSchema="notes" label="Note (Optional)" />
            <div className="flex flex-row justify-between items-center">
              <Button
                variant="outline"
                className="paragraph-medium min-h-10"
                onClick={() => {
                  form.reset();
                  handleClose();
                }}
              >
                Cancel
              </Button>

              <Button
                disabled={isPending}
                className="paragraph-medium min-h-10 rounded-lg bg-blue-500 px-4 py-3 hover:bg-blue-400"
              >
                {isPending
                  ? actionType === "savings"
                    ? buttonText === "Add"
                      ? "Adding..."
                      : "Withdrawing..."
                    : "Saving..."
                  : buttonText}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SavingRecordForm;

"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import DatePickerField from "./input/DatePickerField";
import TextAreaField from "./input/TextareaField";

import InputField from "./input/InputField";

import { CreateSavingGoalSchema } from "@/lib/validation";
import { convertAmountToMiliunits } from "@/lib/utils";
import IconInputField from "./input/IconInputField";
import {
  useCreateSavingGoal,
  useEditSavingGoal,
} from "@/hooks/api/useSavingGoal";

const SavingGoalForm = ({
  type,
  id,
  onClose,
  data,
  relatedData,
}: {
  type: "create" | "update";
  id?: string;
  data?: any;
  relatedData?: any;
  onClose: () => void;
}) => {
  const createSavingGoalMutation = useCreateSavingGoal();
  const editSavingGoalMutation = useEditSavingGoal();

  const form = useForm<z.infer<typeof CreateSavingGoalSchema>>({
    resolver: zodResolver(CreateSavingGoalSchema),
    defaultValues: {
      coverType: type === "update" ? data?.coverType || "icon" : "icon",
      coverImg: type === "update" ? data?.coverImg || "" : "",
      name: type === "update" ? data?.name || "" : "",
      notes: type === "update" ? data?.notes || "" : "",
      targetAmount: type === "update" ? data?.targetAmount || 0 : 0,
      deadline: type === "update" ? data?.deadline || "" : "",
      status: type === "update" ? data?.status || "active" : "active",
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateSavingGoalSchema>) => {
    const amountInMiliunits = convertAmountToMiliunits(values.targetAmount);

    const dateFormatted = new Date(
      Date.UTC(
        values.deadline.getFullYear(),
        values.deadline.getMonth(),
        values.deadline.getDate(),
        0,
        0,
        0
      )
    );

    if (type === "update" && id) {
      editSavingGoalMutation?.mutate(
        {
          ...values,
          targetAmount: amountInMiliunits,
          deadline: dateFormatted,
          goalId: id,
        },
        { onSuccess: () => onClose() }
      );
    } else {
      createSavingGoalMutation.mutate(
        { ...values, targetAmount: amountInMiliunits, deadline: dateFormatted },
        { onSuccess: () => onClose() }
      );
    }
  };

  const buttonText = type === "create" ? "Create goal" : "Save changes";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <IconInputField nameInSchema="coverImg" label="Add Cover" />
        <InputField nameInSchema="name" label="Goal Name" />
        <InputField
          nameInSchema="targetAmount"
          label="Goal Amount"
          type="number"
        />
        <DatePickerField
          nameInSchema="deadline"
          label="Deadline (Optional)"
          isDateLimited={false}
        />

        <TextAreaField nameInSchema="notes" label="Notes" />
        <Button
          disabled={form.formState.isSubmitting}
          className="paragraph-medium min-h-12 w-full rounded-lg bg-blue-500 px-4 py-3 hover:bg-blue-400"
        >
          {form.formState.isSubmitting
            ? buttonText === "Create goal"
              ? "Creating..."
              : "Saving..."
            : buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default SavingGoalForm;

"use client";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import CreatableSelectField from "../input/CreatableSelectField";
import DatePickerField from "../input/DatePickerField";
import TextAreaField from "../input/TextareaField";
import CurrencyAmountField from "../input/CurrencyAmountField";
import InputField from "../input/InputField";

import { Category, Wallet } from "@/types/global";

import { CreateTransactionSchema } from "@/lib/validation";
import { convertAmountToMiliunits } from "@/lib/utils";

import {
  useCreateTransaction,
  useEditTransaction,
} from "@/hooks/api/useTransaction";
import { useCreateWallet } from "@/hooks/api/useWallet";
import { useCreateCategory } from "@/hooks/api/useCategory";

const TransactionForm = ({
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
  const createWalletMutation = useCreateWallet();
  const createCategoryMutation = useCreateCategory();
  const createTransactionMutation = useCreateTransaction();

  const editTransactionMutation =
    type === "update" && id ? useEditTransaction(id) : undefined;

  const form = useForm<z.infer<typeof CreateTransactionSchema>>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      amount: type === "update" ? data?.amount || "" : "",
      payee: type === "update" ? data?.payee || "" : "",
      notes: type === "update" ? data?.notes || "" : "",
      date:
        type === "update"
          ? data?.date || new Date(data?.date || "")
          : new Date(),
      categoryId: type === "update" ? data?.categoryId || null : null,
      walletId: type === "update" ? data?.walletId || null : null,
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateTransactionSchema>) => {
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

    if (type === "update" && id) {
      editTransactionMutation?.mutate(
        {
          ...values,
          amount: amountInMiliunits,
          transactionId: id,
          date: dateFormatted,
        },
        { onSuccess: () => onClose() }
      );
    } else {
      createTransactionMutation.mutate(
        { ...values, amount: amountInMiliunits, date: dateFormatted },
        { onSuccess: () => onClose() }
      );
    }
  };

  const { categoryList, walletList } = relatedData;

  const categoryOptions = (categoryList ?? []).map((category: Category) => ({
    label: category.name,
    value: category.id,
  }));

  const walletOptions = (walletList ?? []).map((wallet: Wallet) => ({
    label: wallet.name,
    value: wallet.id,
  }));

  const handleCreateCategory = async (name: string) => {
    createCategoryMutation.mutate({ name });
  };

  const handleCreateWallet = async (name: string) => {
    createWalletMutation.mutate({ name, initialBalance: "0" });
  };

  const buttonText = type === "create" ? "Create transaction" : "Save changes";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 space-y-4">
        <CreatableSelectField
          nameInSchema="walletId"
          label="Wallet"
          placeholder="Select a wallet"
          options={walletOptions}
          onCreate={handleCreateWallet}
          disable={form.formState.isSubmitting}
        />
        <CurrencyAmountField
          nameInSchema="amount"
          label="Amount"
          placeholder="0.00"
        />
        <CreatableSelectField
          nameInSchema="categoryId"
          label="Category"
          placeholder="Select a category"
          options={categoryOptions}
          onCreate={handleCreateCategory}
          disable={form.formState.isSubmitting}
        />
        <InputField nameInSchema="payee" label="Payee" />
        <TextAreaField nameInSchema="notes" label="Notes" />

        <DatePickerField nameInSchema="date" label="Transaction date" />

        <Button
          disabled={form.formState.isSubmitting}
          className="paragraph-medium min-h-12 w-full rounded-lg bg-blue-500 px-4 py-3 hover:bg-blue-400"
        >
          {form.formState.isSubmitting
            ? buttonText === "Create transaction"
              ? "Creating..."
              : "Saving..."
            : buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default TransactionForm;

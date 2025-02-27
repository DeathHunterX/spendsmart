"use client";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";

import { Button } from "@/components/ui/button";

import { CreateWalletSchema } from "@/lib/validation";
import InputField from "../input/InputField";

import { useCreateWallet, useEditWallet } from "@/hooks/api/useWallet";

const WalletForm = ({
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
  const form = useForm<z.infer<typeof CreateWalletSchema>>({
    resolver: zodResolver(CreateWalletSchema),
    defaultValues: {
      name: type === "update" ? data?.name || "" : "",
      description: type === "update" ? data?.description || "" : "",
      initialBalance: type === "update" ? data?.initialBalance || "0" : "0",
    },
  });

  const createWalletMutation = useCreateWallet();
  const editWalletMutation =
    type === "update" && id ? useEditWallet(id) : undefined;

  const onSubmit = async (values: z.infer<typeof CreateWalletSchema>) => {
    if (type === "update" && id) {
      editWalletMutation?.mutate(
        { ...values, walletId: id },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createWalletMutation.mutate(values, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const buttonText = type === "create" ? "Create wallet" : "Save changes";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 space-y-6">
        <InputField nameInSchema="name" label="Name" />
        <InputField nameInSchema="description" label="Description" />
        <InputField nameInSchema="initialBalance" label="Initial Balance" />

        <Button
          disabled={form.formState.isSubmitting}
          className="paragraph-medium min-h-12 w-full rounded-lg bg-blue-500 px-4 py-3 hover:bg-blue-400"
        >
          {form.formState.isSubmitting
            ? buttonText === "Create wallet"
              ? "Creating..."
              : "Saving..."
            : buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default WalletForm;

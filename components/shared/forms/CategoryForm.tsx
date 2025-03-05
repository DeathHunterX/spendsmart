"use client";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { CreateCategorySchema } from "@/lib/validation";
import InputField from "./input/InputField";
import { useCreateCategory, useEditCategory } from "@/hooks/api/useCategory";
import IconInputField from "./input/IconInputField";
import SelectInputField from "./input/SelectInputField";

const CategoryForm = ({
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
  const form = useForm<z.infer<typeof CreateCategorySchema>>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      name: type === "update" ? data?.name || "" : "",
      type: type === "update" ? data?.type || "income" : "income",
      icon: type === "update" ? data?.icon || "" : "",
    },
  });

  const addCategoryMutation = useCreateCategory();
  const editCategoryMutation =
    type === "update" && id ? useEditCategory(id) : undefined;

  const onSubmit = async (values: z.infer<typeof CreateCategorySchema>) => {
    if (type === "update" && id) {
      editCategoryMutation?.mutate(
        { ...values, categoryId: id },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      addCategoryMutation.mutate(values, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const buttonText = type === "create" ? "Create category" : "Save changes";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-row gap-x-4">
          <InputField nameInSchema="name" label="Name" />
          <SelectInputField
            nameInSchema="type"
            label="Type"
            data={[
              { name: "Income", value: "income" },
              { name: "Expense", value: "expense" },
            ]}
          />
        </div>

        <IconInputField nameInSchema="icon" label="Icon" />

        <Button
          disabled={form.formState.isSubmitting}
          className="paragraph-medium min-h-12 w-full rounded-lg bg-blue-500 px-4 py-3 hover:bg-blue-400"
        >
          {form.formState.isSubmitting
            ? buttonText === "Create category"
              ? "Creating..."
              : "Saving..."
            : buttonText}
        </Button>
      </form>
    </Form>
  );
};

export default CategoryForm;

"use client";

import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form } from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CreateCategorySchema } from "@/lib/validation";
import InputField from "../input/InputField";

import { addCategory, editCategory } from "@/lib/actions/category.action";

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
      description: type === "update" ? data?.description || "" : "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateCategorySchema>) => {
    if (type === "update" && id) {
      const response = await editCategory({ ...values, categoryId: id });
      if (response.success) {
        toast({
          title: "Success",
          description: "Category updated successfully",
        });
      } else {
        toast({
          title: `Error ${response.status}`,
          description: response.error?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } else {
      const response = await addCategory(values);
      if (response.success) {
        toast({
          title: "Success",
          description: "Category created successfully",
        });
      } else {
        toast({
          title: `Error ${response.status}`,
          description: response.error?.message || "Something went wrong",
          variant: "destructive",
        });
      }
    }

    onClose();
  };

  const buttonText = type === "create" ? "Create category" : "Save changes";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-3 space-y-6">
        <InputField nameInSchema="name" label="Name" />
        <InputField nameInSchema="description" label="Description" />

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

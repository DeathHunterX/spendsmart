"use client";

import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import { z, ZodType } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";
import { ActionResponse, Wallet } from "@/types/global";
import { Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useOpenCategory } from "../hooks/use-open-category";

interface FormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse<T>>;
  formType: "CREATE" | "EDIT";
}

const CategoryForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: FormProps<T>) => {
  const { onClose, id } = useOpenCategory();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data: T) => {
    if (id && formType === "EDIT") {
      data = { ...data, categoryId: id };
    }

    const result = (await onSubmit(data)) as ActionResponse<T>;

    if (result?.success) {
      if (formType === "EDIT") {
        toast({
          title: "Edit category successfully ",
        });

        onClose();
      } else {
        toast({
          title: "Add category successfully ",
        });

        onClose();
      }
    }
  };

  const buttonText = formType === "CREATE" ? "Create category" : "Save changes";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-3 space-y-6"
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel className="paragraph-medium flex items-start">
                  {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    {...field}
                    className="paragraph-regular no-focus min-h-12 rounded-md border"
                    placeholder={`Enter ${field.name}...`}
                  />
                </FormControl>
                <FormMessage className="text-left" />
              </FormItem>
            )}
          />
        ))}

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

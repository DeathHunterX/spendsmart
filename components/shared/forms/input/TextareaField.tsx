"use client";

import { FieldValues, useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";
import { TextareaHTMLAttributes } from "react";

type TextAreaFieldProps<S extends FieldValues> = {
  nameInSchema: keyof S & string;
  label: string;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const TextAreaField = <S extends FieldValues>({
  nameInSchema,
  label,
  className,
  ...props
}: TextAreaFieldProps<S>) => {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel
            className="paragraph-small flex items-start"
            htmlFor={nameInSchema}
          >
            {label}
          </FormLabel>

          <FormControl>
            <Textarea
              id={nameInSchema}
              className={`disabled:text-blue-500 dark:disabled:text-yellow-300 disabled:opacity-75 ${className} resize-none`}
              {...props}
              {...field}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TextAreaField;

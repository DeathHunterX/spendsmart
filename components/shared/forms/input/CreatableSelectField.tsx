import React, { SelectHTMLAttributes } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/form";
import { useFormContext, FieldValues, Path } from "react-hook-form";
import { CreatableSelect } from "@/components/custom-ui/creatable-select";

type CreatableSelectFieldProps<S extends FieldValues> = {
  nameInSchema: keyof S;
  label: string;
  placeholder?: string;
  className?: string;
  onCreate?: (value: string) => void;
  options?: { label: string; value: string }[];
  disable?: boolean;
} & SelectHTMLAttributes<HTMLSelectElement>;

const CreatableSelectField = <S extends FieldValues>({
  nameInSchema,
  label,
  placeholder,
  className = "",
  options = [],
  disable,
  onCreate,
}: CreatableSelectFieldProps<S>) => {
  const form = useFormContext<S>();

  return (
    <FormField
      control={form.control}
      name={nameInSchema as Path<S>}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <FormLabel className="paragraph-small flex items-start">
            {label}
          </FormLabel>
          <FormControl>
            <CreatableSelect
              placeholder={placeholder ?? `Select a ${field.name}`}
              options={options}
              value={field.value}
              onCreate={onCreate}
              onChange={field.onChange}
              disabled={disable}
              className={className}
            />
          </FormControl>
          <FormMessage className="text-left" />
        </FormItem>
      )}
    />
  );
};

export default CreatableSelectField;

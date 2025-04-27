import React, { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../ui/form";
import { Input } from "../../../ui/input";
import { useFormContext, FieldValues, Path } from "react-hook-form";

type InputFieldProps<S extends FieldValues> = {
  nameInSchema: keyof S;
  label: string;
  placeholder?: string;
  className?: string;
  type?: HTMLInputTypeAttribute;
} & InputHTMLAttributes<HTMLInputElement>;

const InputField = <S extends FieldValues>({
  nameInSchema,
  label,
  placeholder,
  className = "",
  type = "text",
  ...props
}: InputFieldProps<S>) => {
  const form = useFormContext<S>();

  return (
    <FormField
      control={form.control}
      name={nameInSchema as Path<S>}
      render={({ field, fieldState }) => (
        <FormItem className="flex w-full flex-col">
          <FormLabel
            className="paragraph-small flex items-start"
            htmlFor={nameInSchema as string}
          >
            {label}
          </FormLabel>
          <FormControl>
            <Input
              id={nameInSchema as string}
              type={type}
              className={`paragraph-regular no-focus min-h-12 rounded-md border ${className}`}
              placeholder={placeholder ?? `Enter ${field.name}...`}
              onChange={(e) => {
                if (props.onChange) {
                  props.onChange(e);
                }

                const value = e.target.value;
                let finalValue: string | number = value;

                // Check if the input type is number
                if (type === "number") {
                  const numberValue = Number(value);
                  // Remove leading zeros and set value as long as it's a valid number
                  if (!isNaN(numberValue) && numberValue >= 0) {
                    const strippedValue = value.replace(/^0+(?=\d)/, ""); // Remove leading zeros
                    field.onChange(Number(strippedValue)); // Ensure the value is a number
                    finalValue = Number(strippedValue);
                  } else if (value === "") {
                    // Reset to 0 if input is cleared
                    field.onChange(0);
                    finalValue = 0;
                  }
                } else {
                  field.onChange(value);
                }

                field.onChange(finalValue);
              }}
              value={
                type === "number" && field.value !== undefined
                  ? String(field.value).replace(/^0+(?=\d)/, "") // Ensure no leading zeros in the value
                  : field.value
              }
              {...props}
            />
          </FormControl>
          {fieldState.error ? (
            <FormMessage className="text-red-500">
              {fieldState.error.message}
            </FormMessage>
          ) : (
            <FormMessage className="text-left" />
          )}
        </FormItem>
      )}
    />
  );
};

export default InputField;

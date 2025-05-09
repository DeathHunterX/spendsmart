import { InputHTMLAttributes, useState } from "react";
import { useFormContext, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

type DatePickerFieldProps<S extends FieldValues> = {
  nameInSchema: keyof S;
  label: string;
  placeholder?: string;
  isDateLimited?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

const DatePickerField = <S extends FieldValues>({
  nameInSchema,
  label,
  placeholder,
  isDateLimited = true,
}: DatePickerFieldProps<S>) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const form = useFormContext<S>();

  return (
    <FormField
      control={form.control}
      name={nameInSchema as Path<S>}
      render={({ field }) => (
        <FormItem className="flex flex-col w-full">
          <FormLabel className="paragraph-small flex items-start">
            {label}
          </FormLabel>
          <Popover modal open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>{placeholder ?? "Pick a date"}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(e) => {
                  field.onChange(e);
                  setIsCalendarOpen(false);
                }}
                disabled={(date) =>
                  (isDateLimited ? date > new Date() : date < new Date()) ||
                  date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePickerField;

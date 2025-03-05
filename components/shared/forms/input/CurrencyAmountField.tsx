import { InputHTMLAttributes } from "react";
import { FieldValues, Path, useFormContext } from "react-hook-form";
import CurrencyInput from "react-currency-input-field";

import { Info, MinusCircle, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type CurrencyAmountFieldProps<S extends FieldValues> = {
  nameInSchema: keyof S;
  label: string;
  placeholder?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const CurrencyAmountField = <S extends FieldValues>({
  nameInSchema,
  label,
  placeholder,
  className = "",
}: CurrencyAmountFieldProps<S>) => {
  const form = useFormContext<S>();

  return (
    <FormField
      control={form.control}
      name={nameInSchema as Path<S>}
      render={({ field }) => {
        const parsedValue = parseFloat(field.value);
        const isIncome = parsedValue > 0;
        const isExpense = parsedValue < 0;

        const onReverseValue = () => {
          if (!field.value) return;
          const newValue = parseFloat(field.value) * -1;
          field.onChange(newValue.toString());
        };

        return (
          <FormItem className="flex w-full flex-col">
            <FormLabel
              className="paragraph-small flex items-start"
              htmlFor={nameInSchema as string}
            >
              {label}
            </FormLabel>
            <FormControl>
              <div className="relative">
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        onClick={onReverseValue}
                        className={cn(
                          "absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition",
                          isIncome
                            ? "bg-emerald-500 hover:bg-emerald-600"
                            : isExpense
                              ? "bg-rose-500 hover:bg-rose-600"
                              : "bg-slate-400 hover:bg-slate-500"
                        )}
                      >
                        {!parsedValue && <Info className="size-3 text-white" />}
                        {isIncome && (
                          <PlusCircle className="size-3 text-white" />
                        )}
                        {isExpense && (
                          <MinusCircle className="size-3 text-white" />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Use [+] for income and [-] for expenses
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <CurrencyInput
                  prefix="$"
                  className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  id={nameInSchema as string}
                  name={nameInSchema as string}
                  placeholder={placeholder}
                  value={field.value}
                  decimalsLimit={2}
                  decimalScale={2}
                  onValueChange={field.onChange}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {isIncome && "This will count as income"}
                  {isExpense && "This will count as expense"}
                </p>
              </div>
            </FormControl>
            <FormMessage className="text-left" />
          </FormItem>
        );
      }}
    />
  );
};

export default CurrencyAmountField;

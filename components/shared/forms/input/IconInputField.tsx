import React, { InputHTMLAttributes } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../../../ui/form";
import { FieldValues, Path, useFormContext } from "react-hook-form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CircleOff } from "lucide-react";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useTheme } from "next-themes";
import { useIsMobile } from "@/hooks/use-mobile";

type InputFieldProps<S extends FieldValues> = {
  nameInSchema: keyof S;
  label: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

const IconInputField = <S extends FieldValues>({
  nameInSchema,
  label,
  className = "",
}: InputFieldProps<S>) => {
  const form = useFormContext<S>();
  const theme = useTheme();

  const isMobile = useIsMobile();
  return (
    <FormField
      control={form.control}
      name={nameInSchema as Path<S>}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Popover modal>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} className="h-[100px] w-full">
                    {form.watch(nameInSchema as Path<S>) ? (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-5xl" role="img">
                          {field.value}
                        </span>
                        <p className="text-xs text-muted-foreground">
                          Click to change
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <CircleOff className="h-[48px] w-[48px]" />
                        <p className="text-xs text-muted-foreground">
                          Click to select
                        </p>
                      </div>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-full border-none bg-inherit shadow-none p-0 md:mr-3"
                  side={isMobile ? "bottom" : "left"}
                >
                  {/* <p>Hello</p> */}
                  <Picker
                    data={data}
                    // theme={theme.resolvedTheme}
                    previewPosition="bottom"
                    onEmojiSelect={(emoji: { native: string }) => {
                      field.onChange(emoji.native);
                    }}
                    skinTonePosition="none"
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormDescription>
              This is how your category will appear in the app
            </FormDescription>
          </FormItem>
        );
      }}
    />
  );
};

export default IconInputField;

"use client";

import Link from "next/link";
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

import { toast } from "@/hooks/use-toast";
import { AUTH_ROUTES, DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";
import { ActionResponse } from "@/types/global";
import { useRouter } from "next/navigation";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse>;
  formType: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data: T) => {
    const result = (await onSubmit(data)) as ActionResponse;

    if (result?.success) {
      toast({
        title: "Success",
        description:
          formType === "SIGN_IN"
            ? "Signed in successfully"
            : "Signed up successfully. Check your mail for email verification",
      });
      router.push(
        formType === "SIGN_IN" ? DEFAULT_LOGIN_REDIRECT : AUTH_ROUTES.SIGN_IN
      );

      if (formType === "SIGN_IN") {
        window.location.reload();
      }
    } else {
      toast({
        title: `Error ${result?.status}`,
        description: result?.error?.message,
        variant: "destructive",
      });
    }
  };

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

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
                  {field.name === "email"
                    ? "Email Address"
                    : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <Input
                    required
                    type={field.name === "password" ? "password" : "text"}
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
            ? buttonText === "Sign In"
              ? "Signin In..."
              : "Signing Up..."
            : buttonText}
        </Button>

        {formType === "SIGN_IN" ? (
          <p className="text-sm leading-relaxed">
            Not registered yet?{" "}
            <Link href={AUTH_ROUTES.SIGN_UP} className="paragraph-semibold">
              Create an Account
            </Link>
          </p>
        ) : (
          <p className="text-sm leading-relaxed">
            Already have an account?{" "}
            <Link href={AUTH_ROUTES.SIGN_IN} className="paragraph-semibold">
              Sign in
            </Link>
          </p>
        )}
      </form>
    </Form>
  );
};

export default AuthForm;

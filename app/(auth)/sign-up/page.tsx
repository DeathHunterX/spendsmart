"use client";
import { SignUpSchema } from "@/lib/validation";
import { signUpWithCredentials } from "@/lib/actions/auth/signUp.action";

import AuthForm from "@/components/shared/forms/auth/AuthForm";
import SocialAuthForm from "@/components/shared/forms/auth/SocialAuthForm";
import AuthPageWrapper from "@/components/shared/wrapper/AuthPageWrapper";

const SignUpPage = () => {
  return (
    <AuthPageWrapper
      title="Get Started Now!"
      description="Join SpendSmart to manage your finances and save better!"
    >
      <div className="flex flex-col items-center">
        <div className="flex size-full flex-col rounded-3xl bg-white pb-6 text-center">
          <SocialAuthForm />

          <div className="mt-4 flex items-center">
            <hr className="h-0 grow border-b border-solid border-gray-200" />
            <p className="mx-4 text-gray-400">or</p>
            <hr className="h-0 grow border-b border-solid border-gray-200" />
          </div>

          <AuthForm
            formType="SIGN_UP"
            schema={SignUpSchema}
            defaultValues={{
              name: "",
              email: "",
              password: "",
            }}
            onSubmit={signUpWithCredentials}
          />
        </div>
      </div>
    </AuthPageWrapper>
  );
};

export default SignUpPage;

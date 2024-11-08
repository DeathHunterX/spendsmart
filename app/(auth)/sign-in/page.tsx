"use client";

import AuthForm from "@/components/shared/forms/AuthForm";
import SocialAuthForm from "@/components/shared/forms/SocialAuthForm";
import { SignInSchema } from "@/lib/validation";
import Image from "next/image";
import React from "react";

const SignInPage = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="h-full flex-col items-center justify-center px-4 lg:flex">
        <div className="space-y-4 pt-8 text-center">
          <h1 className="text-3xl font-bold text-[#2E2A47]">Welcome Back!</h1>
          <p className="text-base text-[#7E8CA0]">
            Log in or Create account to get back to your dashboard!
          </p>
        </div>
        <div className="mt-8 flex w-full items-center justify-center">
          {/* -------------- */}
          <div className="flex flex-col items-center">
            <div className="flex size-full flex-col rounded-3xl bg-white pb-6 text-center">
              <SocialAuthForm />

              <div className="mt-4 flex items-center">
                <hr className="h-0 grow border-b border-solid border-gray-200" />
                <p className="mx-4 text-gray-400">or</p>
                <hr className="h-0 grow border-b border-solid border-gray-200" />
              </div>

              <AuthForm
                formType="SIGN_IN"
                schema={SignInSchema}
                defaultValues={{ email: "", password: "" }}
                onSubmit={(data) => Promise.resolve({ success: true, data })}
              />
            </div>
          </div>
          {/* -------------- */}
        </div>
      </div>
      <div className="hidden h-full items-center justify-center bg-blue-600 lg:flex">
        <Image src="/logo.svg" width={100} height={100} alt="logo" />
      </div>
    </div>
  );
};

export default SignInPage;

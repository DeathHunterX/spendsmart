import SocialAuthForm from "@/components/shared/forms/SocialAuthForm";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SignInPage = () => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="h-full flex-col items-center justify-center px-4 lg:flex">
        <div className="space-y-4 pt-16 text-center">
          <h1 className="text-3xl font-bold text-[#2E2A47]">Welcome Back!</h1>
          <p className="text-base text-[#7E8CA0]">
            Log in or Create account to get back to your dashboard!
          </p>
        </div>
        <div className="mt-8 flex w-full items-center justify-center">
          {/* -------------- */}
          <div className="flex flex-col items-center xl:p-10">
            <div className="flex size-full flex-col rounded-3xl bg-white pb-6 text-center">
              <h3 className="text-4xl font-extrabold text-[#2E2A47]">
                Sign In
              </h3>
              <p className="mt-3 text-[#7E8CA0]">
                Enter your email and password
              </p>
              <SocialAuthForm />

              <div className="mt-4 flex items-center">
                <hr className="h-0 grow border-b border-solid border-gray-200" />
                <p className="mx-4 text-gray-400">or</p>
                <hr className="h-0 grow border-b border-solid border-gray-200" />
              </div>

              {/* AuthForm */}
            </div>

            <p className="text-sm leading-relaxed text-gray-900">
              Not registered yet?{" "}
              <Link href="/sign-up" className="font-bold text-gray-700">
                Create an Account
              </Link>
            </p>
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

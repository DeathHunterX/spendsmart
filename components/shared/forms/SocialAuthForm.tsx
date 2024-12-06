"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";
import React from "react";

import { toast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/constants/routes";

const SocialAuthForm = () => {
  const signInWithOAuth = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        redirect: false,
        redirectTo: DEFAULT_LOGIN_REDIRECT,
      });
    } catch (error) {
      toast({
        title: "Sign-in Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during sign-in",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-row gap-2.5">
      <Button
        className="body-medium min-h-12 flex-1 rounded bg-gray-100 px-4 py-3.5 text-gray-900 hover:bg-gray-400"
        onClick={() => signInWithOAuth("github")}
      >
        <Image
          src="/icons/github.svg"
          alt="Github Logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain"
        />
        <span>Log in with GitHub</span>
      </Button>

      <Button
        className="body-medium min-h-12 flex-1 rounded bg-gray-100 px-4 py-3.5 text-gray-900 hover:bg-gray-400"
        onClick={() => signInWithOAuth("google")}
      >
        <Image
          src="/icons/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain"
        />
        <span>Log in with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;

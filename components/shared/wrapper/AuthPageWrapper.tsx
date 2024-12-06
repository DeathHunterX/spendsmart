import Image from "next/image";
import React from "react";

interface AuthLayoutProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

const AuthPageWrapper = ({ title, description, children }: AuthLayoutProps) => {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="h-full flex-col items-center justify-center px-4 lg:flex">
        <div className="space-y-4 pt-8 text-center">
          <h1 className="text-3xl font-bold text-[#2E2A47]">{title}</h1>
          <p className="text-base text-[#7E8CA0]">{description}</p>
        </div>
        <div className="mt-8 flex w-full items-center justify-center">
          {/* -------------- */}
          {children}
          {/* -------------- */}
        </div>
      </div>
      <div className="hidden h-full items-center justify-center bg-blue-600 lg:flex">
        <Image src="/logo-white.svg" width={100} height={100} alt="logo" />
      </div>
    </div>
  );
};

export default AuthPageWrapper;

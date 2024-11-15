import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "SpendSmart",
  description: "Generated by create next app",
  icons: {
    icon: "/logo-blue.svg",
  },
};

const MainLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <SessionProvider session={session}>
        <body className="antialiased">
          {children}
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
};

export default MainLayout;

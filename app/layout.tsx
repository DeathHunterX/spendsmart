import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

import AuthProvider from "@/providers/AuthProvider";
import { ThemeProvider } from "@/context/Theme";
import { QueryProvider } from "@/providers/QueryProvider";
import { AppMetadata } from "./metadata";

export const metadata: Metadata = { ...AppMetadata };

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className="antialiased">
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <Toaster />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;

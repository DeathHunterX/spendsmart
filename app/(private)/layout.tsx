"use client";

import React, { useEffect, useState } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "@/components/shared/sidebar/LeftSidebar";
import { Separator } from "@/components/ui/separator";
import Breadcrumbs from "@/components/shared/breadcrumbs";
import SearchInput from "@/components/shared/search/GlobalSearchInput";
import UserNav from "@/components/shared/sidebar/UserNav";
import SheetProvider from "@/providers/SheetProvider";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);

  // Only render after first client-side mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // or a loading skeleton

  return (
    <div className="relative">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex shrink-0 items-center justify-between gap-2 p-3 ease-linear ">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumbs />
            </div>
            <div className=" hidden w-1/3 items-center gap-2 px-4 md:flex">
              <SearchInput />
            </div>
            <div className="flex items-center gap-2 px-4">
              <UserNav />
              {/* <ThemeToggle /> */}
            </div>
          </header>
          {/* page main content */}
          <section className="px-8 h-full mt-3">{children}</section>
        </SidebarInset>
      </SidebarProvider>
      <SheetProvider />
    </div>
  );
};

export default PrivateLayout;

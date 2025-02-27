"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { Icons } from "../icons";

import { navMain } from "@/constants";
const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex py-2.5 text-sidebar-accent-foreground">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            <Image src="/logo-blue.svg" width={26} height={26} alt="Logo" />
          </div>
          <div className="grid flex-1 items-center text-left text-xl leading-tight text-blue-500">
            <span className="truncate font-semibold flex items-end">
              <p className="text-2xl">S</p>pend
              <p className="text-2xl">S</p>mart
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        {navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarMenu>
              {item.items?.map((subItem) => {
                const Icon = subItem.icon
                  ? Icons[subItem.icon as keyof typeof Icons]
                  : Icons.logo;
                return (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={subItem.title}
                      isActive={pathname === subItem.url}
                    >
                      <Link href={subItem.url}>
                        <Icon />
                        <span>{subItem.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;

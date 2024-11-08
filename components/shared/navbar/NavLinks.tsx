"use client";

import React from "react";
import Link from "next/link";
import { SheetClose } from "@/components/ui/sheet";
import { beforeAuthNavLinks } from "@/constants";

const NavLinks = ({ isMobileNav = false }: { isMobileNav?: boolean }) => {
  return (
    <>
      {beforeAuthNavLinks.map((item) => {
        const LinkComponent = (
          <Link
            href={item.route}
            key={item.label}
            className="flex items-center justify-start gap-4 bg-transparent"
          >
            <p
              className={`text-xl font-semibold md:text-base md:text-white ${!isMobileNav && "max-md:hidden"}`}
            >
              {item.label}
            </p>
          </Link>
        );

        return isMobileNav ? (
          <SheetClose asChild key={item.route}>
            {LinkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={item.route}>{LinkComponent}</React.Fragment>
        );
      })}
    </>
  );
};

export default NavLinks;

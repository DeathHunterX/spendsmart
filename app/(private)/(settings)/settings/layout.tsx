"use client";
import React, { Fragment } from "react";

import { settingsDropdown } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SettingsLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();

  return (
    <Fragment>
      <div className="border-b-2 border-gray-200">
        <ul className="flex items-center space-x-4">
          {settingsDropdown.map((item) => (
            <li
              key={item.title}
              className={`relative p-2 text-base font-medium`}
            >
              <Link href={item.url}>
                {item.title}
                {pathname === item.url && (
                  <span className="absolute bottom-[-2px] left-0 h-[2px] w-full bg-black "></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {children}
    </Fragment>
  );
};

export default SettingsLayout;

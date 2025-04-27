import React from "react";
import NavbarLogo from "./Logo";
import MobileNavigation from "./MobileNav";
import NavLinks from "./NavLinks";
import Link from "next/link";
import { AUTH_ROUTES } from "@/constants/routes";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="flex-between sticky z-50 w-full gap-5 bg-gradient-to-b from-blue-700 to-blue-500 px-8 py-4">
      <div className="flex flex-row gap-16">
        <NavbarLogo />
        <div className="flex flex-row gap-5">
          <NavLinks />
        </div>
      </div>
      <div className="flex flex-row gap-5 ">
        <MobileNavigation />
        <div className="hidden md:flex">
          <Link href={AUTH_ROUTES.SIGN_IN}>
            <Button className="bg-transparent hover:bg-transparent">
              Sign In
            </Button>
          </Link>

          <Link href={AUTH_ROUTES.SIGN_UP}>
            <Button className=" min-h-[41px] w-full rounded-full border border-white-100 bg-white-100  px-4 py-3 text-blue-600 hover:border-blue-400 hover:bg-blue-400 hover:text-white">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

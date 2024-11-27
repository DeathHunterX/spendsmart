import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AUTH_ROUTES } from "@/constants/routes";
// import NavLinks from "./NavLinks";
import NavbarLogo from "./Logo";
import NavLinks from "./NavLinks";

const MobileNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/icons/hamburger.svg"
          width={36}
          height={36}
          alt="Menu"
          className="sm:hidden"
        />
      </SheetTrigger>
      <SheetContent side="left" className="border-none">
        <SheetTitle className="hidden">Navigation</SheetTitle>
        <NavbarLogo />

        <div className="flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto">
          <section className="flex h-full flex-col gap-6">
            <NavLinks isMobileNav />
          </section>

          <SheetFooter>
            <div className="flex flex-col gap-3 ">
              <SheetClose asChild>
                <Link href={AUTH_ROUTES.SIGN_IN}>
                  <Button className="btn-outline no-focus min-h-[41px] w-full px-4 py-3">
                    Sign In
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link href={AUTH_ROUTES.SIGN_UP}>
                  <Button className="btn no-focus min-h-[41px] w-full border px-4 py-3">
                    Sign Up
                  </Button>
                </Link>
              </SheetClose>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;

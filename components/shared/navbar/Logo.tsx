import Image from "next/image";
import Link from "next/link";
import React from "react";

const NavbarLogo = () => {
  return (
    <div className="flex items-center">
      <Image src="/logo.svg" width={26} height={26} alt="Logo" />

      <Link href="/">
        <p className="ml-2.5 text-xl font-semibold text-white">SpendSmart</p>
      </Link>
    </div>
  );
};

export default NavbarLogo;

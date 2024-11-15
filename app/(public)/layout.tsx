import Navbar from "@/components/shared/navbar";
import React from "react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <Navbar />
      {children}
    </div>
  );
};

export default RootLayout;

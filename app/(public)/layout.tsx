import Navbar from "@/components/shared/navbar";
import React from "react";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative">
      <Navbar />
      {children}
    </div>
  );
};

export default PublicLayout;

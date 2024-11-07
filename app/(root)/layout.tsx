import React from "react";

import LeftSideBar from "@/components/shared/sidebar/LeftSideBar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="">
      <LeftSideBar />
      {children}
    </main>
  );
};

export default RootLayout;

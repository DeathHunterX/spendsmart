import { signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import LeftSideBar from "@/components/shared/sidebar/LeftSideBar";

import React from "react";

const UserHomePage = () => {
  return (
    <div>
      <LeftSideBar />
      <h3>UserHomePage</h3>

      <form
        className="px-10 pt-[100px]"
        action={async () => {
          "use server";

          await signOut({ redirectTo: ROUTES.SIGN_IN });
        }}
      >
        <Button type="submit">Log out</Button>
      </form>
    </div>
  );
};

export default UserHomePage;

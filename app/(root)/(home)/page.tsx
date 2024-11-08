import React from "react";
import GuestHomePage from "./guest";
import UserHomePage from "./user";
import { auth } from "@/auth";

const Homepage = async () => {
  const session = await auth();

  if (session) {
    return <UserHomePage />;
  } else {
    return <GuestHomePage />;
  }
};

export default Homepage;

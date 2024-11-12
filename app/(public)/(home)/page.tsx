import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const Homepage = async () => {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return <div className="">GuestHomePage</div>;
};

export default Homepage;

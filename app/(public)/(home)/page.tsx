import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

const LandingPage = async () => {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return <div className="min-h-screen bg-white">Landing Page</div>;
};

export default LandingPage;

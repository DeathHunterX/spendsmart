import React from "react";
import { Metadata } from "next";
import AccountSection from "@/components/shared/section/(settings)/AccountSection";

export const metadata: Metadata = {
  title: "Account | SpendSmart",
};

const AccountPage = () => {
  return <AccountSection />;
};

export default AccountPage;

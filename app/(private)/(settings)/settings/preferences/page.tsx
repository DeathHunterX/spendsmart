import PreferencesSection from "@/components/shared/section/(settings)/PreferencesSection";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Preferences | SpendSmart",
};

const PreferencesPage = () => {
  return <PreferencesSection />;
};

export default PreferencesPage;

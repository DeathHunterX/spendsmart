import LocalizationSection from "@/components/shared/section/(settings)/LocalizationSection";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Localization | SpendSmart",
};

const LocalizationPage = () => {
  return <LocalizationSection />;
};

export default LocalizationPage;

/* eslint-disable tailwindcss/no-custom-classname */
"use client";
import React, { useEffect, useState } from "react";
import SettingsCard from "../../card/SettingsCard";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import "../../../../node_modules/flag-icons/css/flag-icons.min.css";
import { useTheme } from "next-themes";

interface Country {
  code: string;
  name: string;
}

const PreferencesSection = () => {
  const [countryData, setCountryData] = useState<Array<Country>>([]);
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://cdn.simplelocalize.io/public/v1/countries",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      setCountryData(json);
    }
    fetchData();
  }, []);
  return (
    <section className="flex flex-col">
      <SettingsCard
        type="custom"
        name="Language Settings"
        description="Display the app in your selected language."
      >
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {countryData.map((country) => (
              <SelectItem key={country?.code} value={country?.code}>
                <span className={`fi fi-${country.code.toLowerCase()}`}></span>
                <span className="ps-2">{country?.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingsCard>
      <SettingsCard
        type="select"
        name="Theme"
        description="Set unique code that appears on SpendSmart communications from us to you"
        data={countryData}
        onAction={(data) => setTheme(data)}
        value={theme}
      />
      <SettingsCard
        type="button"
        name="Web Contacts"
        description="Set unique code that appears on SpendSmart communications from us to you"
        btnName="Open Web Contacts"
      />
      <SettingsCard
        type="button"
        name="API Token"
        description="Set unique code that appears on SpendSmart communications from us to you"
        btnName="Open API Token"
      />
      <SettingsCard
        type="button"
        name="Secure Communication Code"
        description="Set unique code that appears on SpendSmart communications from us to you"
        btnName="Create Communication Code"
      />
      <SettingsCard
        type="button"
        name="Close your account"
        btnName="Close"
        variant="destructive"
        customStyling=""
      />
    </section>
  );
};

export default PreferencesSection;

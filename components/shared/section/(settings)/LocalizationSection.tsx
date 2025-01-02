import React from "react";
import SettingsCard from "../../card/SettingsCard";

const LocalizationSection = () => {
  return (
    <section className="flex flex-col">
      <SettingsCard
        type="text"
        name="Currency"
        description="Choose your timezone and preferred format"
        data="United States Dollar (USD)"
      />
      <SettingsCard
        type="text"
        name="Timezone"
        description="Choose your timezone and preferred format"
        data="GMT -4:00, 12-hours format"
      />
      <SettingsCard
        type="text"
        name="Date Format"
        description="Update your company logo"
        data="DD/MM/YYYY"
      />
    </section>
  );
};

export default LocalizationSection;

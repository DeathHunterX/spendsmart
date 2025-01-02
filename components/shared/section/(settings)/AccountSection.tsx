"use client";

import React from "react";
import SettingsCard from "../../card/SettingsCard";
import { useSession } from "next-auth/react";

const AccountSection = () => {
  const { data: session } = useSession();

  return (
    <section className="flex flex-col">
      <SettingsCard
        type="id"
        name="SpendSmartID"
        description=""
        data={session?.user?.id}
      />
      <SettingsCard
        type="photo"
        name="Profile Photo"
        description="Min 400x400px, PNG or JPEG formats."
        data={session?.user}
      />
      <SettingsCard
        type="text"
        name="Full Name"
        description="The official full name for contact requests."
        data={session?.user?.name}
      />
      <SettingsCard
        type="text"
        name="Email Address"
        description="The official email address for contact requests."
        data={session?.user?.email}
      />
      <SettingsCard
        type="text"
        name="Phone Number"
        description="The official phone number for contact requests."
        data={session?.user?.email}
      />
      <SettingsCard
        type="text"
        name="Address"
        description="The official residential address for shipments"
        data={session?.user?.email}
      />
    </section>
  );
};

export default AccountSection;

import React from "react";
import SettingsCard from "../../card/SettingsCard";
import { generalNotifications, notificationMethod } from "@/data/mockData";

const NotificationsSection = () => {
  return (
    <section className="flex flex-col">
      <SettingsCard
        type="switch"
        name="General Notifications"
        description="Notifications about transactions, balance and exclusive offers"
        data={generalNotifications}
      />

      <SettingsCard
        type="checkbox"
        name="Notification Method"
        description="Choose how you prefer to receive notifications"
        data={notificationMethod}
      />
    </section>
  );
};

export default NotificationsSection;

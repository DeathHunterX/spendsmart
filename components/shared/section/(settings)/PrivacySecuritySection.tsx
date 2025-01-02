import SettingsCard from "../../card/SettingsCard";

const PrivacySecuritySection = () => {
  return (
    <section className="flex flex-col">
      <SettingsCard
        type="input-hidden"
        name="Change Password"
        description="Change your password if you think your password is need to change"
        btnName="Change"
      />

      <SettingsCard
        type="button"
        name="Backup Codes"
        description="Create an store new backup codes for use in the event of losing access to your authentication app"
        btnName="Generate Codes"
      />

      <SettingsCard
        type="status"
        name="Two Step Verification"
        description="We use two step verification when we need to check it's really you using your account"
        btnName="Change"
      />
    </section>
  );
};

export default PrivacySecuritySection;

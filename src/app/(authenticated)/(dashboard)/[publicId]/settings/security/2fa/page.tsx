import { SettingsHeader } from "@/components/security/SettingHeader";

export default function TwoFactorAuthPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "0.75rem" }}>
      <SettingsHeader
        title="Manage Two-factor Authentication"
        subtitle="Coming soon!"
      />
    </div>
  );
}

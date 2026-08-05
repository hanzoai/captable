import { Card } from "@hanzo/ui";
import { PageLayout } from "@/components/dashboard/page-layout";
import { SettingsSidebar } from "@/components/settings/settings-sidebar";
import { IS_BILLING_ENABLED } from "@/constants/stripe";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageLayout title="Settings">
      <div className="settings-grid">
        <div>
          <SettingsSidebar isBillingEnabled={IS_BILLING_ENABLED} />
        </div>
        <div>
          <Card style={{ padding: "1.25rem" }}>{children}</Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default SettingsLayout;

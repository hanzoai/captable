import { Button } from "@hanzo/ui";
import EmptyState from "@/components/common/empty-state";
import { RiArrowRightLine, RiPieChartFill } from "@remixicon/react";
import Link from "next/link";

type EmptyOverviewProps = {
  firstName: string | undefined;
  publicCompanyId: string;
};

const EmptyOverview = ({ firstName, publicCompanyId }: EmptyOverviewProps) => {
  return (
    <EmptyState
      icon={<RiPieChartFill />}
      title={`Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || "Hanzo Captable"} ${firstName && `, ${firstName}`} 👋`}
      subtitle={
        <span style={{ color: "var(--muted-foreground)" }}>
          We will get you setup with your Captable in no time.
        </span>
      }
    >
      <Button size="lg">
        <Link href={`/${publicCompanyId}/stakeholders`}>
          Let{`'`}s get started
          <RiArrowRightLine
            size={16}
            style={{ marginLeft: "1.25rem", display: "inline-block" }}
          />
        </Link>
      </Button>
    </EmptyState>
  );
};

export default EmptyOverview;

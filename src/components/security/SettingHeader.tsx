import { withServerComponentSession } from "@/server/auth";
import { RiArrowLeftLine } from "@remixicon/react";
import Link from "next/link";
import type React from "react";

type SettingsHeaderProps = {
  title: string;
  subtitle: string;
  showBackArrow?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
};

export const SettingsHeader = async ({
  children,
  title,
  subtitle,
  showBackArrow = true,
  style,
}: SettingsHeaderProps) => {
  const session = await withServerComponentSession();

  const href = `/${session?.user.companyPublicId}/settings/security`;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        ...style,
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "0.25rem",
          }}
        >
          {showBackArrow && (
            <Link href={href}>
              <RiArrowLeftLine style={{ color: "#1e293b" }} />
            </Link>
          )}
          <h3 style={{ fontSize: "1.125rem", fontWeight: 500 }}>{title}</h3>
        </div>

        <p
          style={{
            color: "var(--muted-foreground)",
            fontSize: "0.875rem",
            marginTop: "0.5rem",
          }}
        >
          {subtitle}
        </p>
      </div>
      {children}
    </div>
  );
};

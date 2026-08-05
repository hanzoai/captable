import type { ReactNode } from "react";

interface PageLayoutProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
}

export function PageLayout({
  action,
  children,
  title,
  description,
}: PageLayoutProps) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", rowGap: "0.75rem" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3 style={{ fontWeight: 500 }}>{title}</h3>
          {description && (
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--muted-foreground)",
              }}
            >
              {description}
            </p>
          )}
        </div>

        <div>{action}</div>
      </div>

      {children}
    </div>
  );
}

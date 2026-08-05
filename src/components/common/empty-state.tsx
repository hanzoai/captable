"use client";

/* Usage:
  <EmptyState
    icon={<RiLandscapeFill />}
    title="This is title"
    subtitle="This is subtitle">
    <Button size="lg">Button</Button>
  </EmptyState>
*/

export type EmptyStateProps = {
  title?: string;
  bordered?: boolean;
  subtitle: string | React.ReactNode;
  icon?: React.ReactElement<React.SVGProps<SVGSVGElement>>;
  children?: React.ReactNode;
  error?: boolean;
};

const EmptyState = ({
  icon,
  title,
  bordered = true,
  subtitle,
  children,
  error = false,
}: EmptyStateProps) => {
  return (
    <div role="alert" style={{ overflow: "hidden" }}>
      <div style={{ margin: "0 auto", padding: "0 1rem" }}>
        <div
          style={{
            background: "#fff",
            padding: "0 1.5rem",
            boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            ...(bordered && {
              borderRadius: "0.75rem",
              border: "1px solid var(--border)",
            }),
          }}
        >
          <div
            style={{
              margin: "0 auto",
              width: "100%",
              maxWidth: "42rem",
              padding: "4rem 0",
              textAlign: "center",
            }}
          >
            <div
              className="center"
              style={{
                margin: "0 auto 1.5rem",
                height: "4rem",
                width: "4rem",
                borderRadius: "9999px",
                background: error ? "#ffe4e6" : "#ccfbf1",
              }}
            >
              <span style={{ color: error ? "#f43f5e" : "#14b8a6" }}>
                {icon}
              </span>
            </div>

            {title && (
              <h3
                style={{
                  marginBottom: "1.25rem",
                  fontSize: "1.875rem",
                  fontWeight: 600,
                }}
              >
                {title}
              </h3>
            )}
            <p style={{ marginBottom: "1.5rem" }}>{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;

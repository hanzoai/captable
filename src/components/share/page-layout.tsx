import { Avatar, AvatarImage, Card } from "@hanzo/ui";
import { APP_NAME } from "@/lib/branding";
import Link from "next/link";

type SharePageLayoutProps = {
  medium: string;
  company: {
    name: string;
    logo: string | null;
  };
  title: React.ReactNode;
  children: React.ReactNode;
};

export const SharePageLayout = ({
  company,
  title,
  medium,
  children,
}: SharePageLayoutProps) => (
  <div className="share-screen">
    <div className="share-frame">
      <div
        style={{
          marginBottom: "4rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <Avatar
          style={{ height: "3rem", width: "3rem", borderRadius: "0.25rem" }}
        >
          <AvatarImage src={company.logo || "/placeholders/company.svg"} />
        </Avatar>

        <span style={{ fontSize: "1.125rem", fontWeight: 600 }}>
          {company.name}
        </span>
      </div>

      <div style={{ marginBottom: "1.25rem" }}>{title}</div>

      <Card style={{ padding: "2.5rem" }}>{children}</Card>

      <div
        style={{
          margin: "2.5rem 0",
          textAlign: "center",
          fontSize: "0.875rem",
          color: "var(--muted-foreground)",
        }}
      >
        <p>
          Powered by{" "}
          <Link
            href={`${process.env.NEXT_PUBLIC_APP_URL || "https://captable.hanzo.ai"}?utm_source=${company.name}&utm_medium=${medium}&utm_campaign=powered_by`}
            target="_blank"
            rel="noopener noreferrer"
            className="share-powered"
          >
            {APP_NAME}
          </Link>
        </p>
      </div>
    </div>
  </div>
);

export default SharePageLayout;

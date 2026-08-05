import { Button } from "@hanzo/ui";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Set Password'",
};

export default function SetPasswordWithoutTokenPage() {
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-head">
          <h1 className="auth-title">
            Uh oh! Looks like you&apos;re missing a token
          </h1>

          <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
            It seems that there is no token provided, if you are trying to set
            your password please follow the link in your email.
          </p>

          <Link href="/" style={{ marginTop: "1rem" }}>
            <Button size="lg">Go back home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

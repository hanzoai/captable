import { Button } from "@hanzo/ui";
import { RiCheckboxCircleLine } from "@remixicon/react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Password Updated",
};

export default function PasswordUpdated() {
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-head">
          <RiCheckboxCircleLine size={40} style={{ alignSelf: "center" }} />
          <h1 className="auth-title">Password Updated</h1>

          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--muted-foreground)",
            }}
          >
            Your password has been updated successfully.
          </p>

          <Link href="/" style={{ marginTop: "1rem" }}>
            <Button size="lg">Return to login page</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

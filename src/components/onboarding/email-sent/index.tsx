"use client";

import { Button } from "@hanzo/ui";
import { RiMailLine } from "@remixicon/react";
import Link from "next/link";

const EmailSent = () => {
  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-head">
          <RiMailLine
            size={40}
            style={{ marginBottom: "0.25rem", alignSelf: "center" }}
          />
          <h1 className="auth-title">Email sent!</h1>
        </div>
        <div style={{ textAlign: "center" }}>
          A password reset email has been sent, if you have an account you
          should see it in your inbox shortly.
        </div>
        <Link href="/" style={{ marginTop: "1rem", textAlign: "center" }}>
          <Button size="lg">Back to login</Button>
        </Link>
      </div>
    </div>
  );
};
export default EmailSent;

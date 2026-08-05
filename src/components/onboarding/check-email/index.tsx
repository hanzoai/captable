"use client";

import { Button } from "@hanzo/ui";
import { api } from "@/trpc/react";
import { RiMailLine } from "@remixicon/react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const CheckEmailComponent = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const { mutateAsync, isLoading } = api.auth.resendEmail.useMutation({
    onSuccess: () => {
      toast.success("🎉 Email successfully re-sent.");
    },
    onError: () => {
      toast.error(
        "Uh oh! Something went wrong, please try again or contact support.",
      );
    },
  });

  async function Resend() {
    try {
      if (email) {
        await mutateAsync(email);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-head">
          <div
            className="center"
            style={{
              margin: "0 auto 1.5rem",
              height: "4rem",
              width: "4rem",
              borderRadius: "9999px",
              background: "#ccfbf1",
            }}
          >
            <span style={{ color: "#14b8a6" }}>
              <RiMailLine size={24} />
            </span>
          </div>
          <h1 className="auth-title">Check your email</h1>
        </div>
        <div style={{ marginBottom: "0.5rem", textAlign: "center" }}>
          We&apos;ve sent an email to
          <span style={{ fontSize: "0.875rem", fontWeight: 700 }}>
            {" "}
            {email}{" "}
          </span>
          . Please click the link in the email to verify your account.
        </div>
        <Button onClick={Resend} disabled={!email} loading={isLoading}>
          Resend verification email
        </Button>
      </div>
    </div>
  );
};

export default CheckEmailComponent;

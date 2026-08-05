"use client";

import { Button } from "@hanzo/ui";
import { api } from "@/trpc/react";
import {
  RiArrowRightLine,
  RiMailCheckLine,
  RiMailCloseLine,
} from "@remixicon/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const VerifyEmail = ({ token }: { token: string }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const { mutateAsync } = api.auth.verifyEmail.useMutation({
    onSuccess: async ({ message }) => {
      setLoading(false);
      setSuccess(message);
    },
    onError: (error) => {
      setLoading(false);
      setError(error.message);
    },
  });

  const onSubmit = useCallback(async () => {
    if (success || error) return;

    if (!token) {
      setLoading(false);
      setError("Missing token!");
      return;
    }

    try {
      await mutateAsync(token);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Something went wrong! Please try again.");
    }
  }, [token, success, error]);

  useEffect(() => {
    void onSubmit();
  }, [onSubmit]);

  if (loading) {
    return (
      <div className="auth-screen">
        <div className="auth-card">
          <div className="auth-head">
            <h1 className="auth-title">Verifying...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-head">
          {success ? (
            <>
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
                  <RiMailCheckLine size={24} />
                </span>
              </div>
              <h1 className="auth-title">{success}</h1>
              <div className="auth-sub">
                Your account has been verified. Please login to continue.
              </div>
            </>
          ) : (
            <>
              <RiMailCloseLine
                size={40}
                style={{ marginBottom: "0.25rem", alignSelf: "center" }}
              />
              <h1 className="auth-title">Verification Failed</h1>
              <div className="auth-sub">{error}</div>
            </>
          )}

          {success ? (
            <Link href="/signin" style={{ marginTop: "1rem" }}>
              <Button size="lg">
                Continue to Login page
                <RiArrowRightLine size={16} style={{ marginLeft: "0.5rem" }} />
              </Button>
            </Link>
          ) : (
            <Link href="/signup" style={{ marginTop: "1rem" }}>
              <Button size="lg">
                Try signing up again
                <RiArrowRightLine size={16} style={{ marginLeft: "0.5rem" }} />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

"use client";

import { Button } from "@hanzo/ui";
import { RiGoogleFill as GoogleIcon } from "@remixicon/react";
import { signIn } from "next-auth/react";

async function signInWithGoogle() {
  await signIn("google", { callbackUrl: "/onboarding" });
}

const LoginWithGoogle = () => {
  return (
    <Button
      type="button"
      size="xl"
      onClick={signInWithGoogle}
      style={{ borderRadius: "0.75rem" }}
    >
      <GoogleIcon size={24} style={{ marginRight: "0.5rem" }} />
      <span style={{ fontSize: "1.125rem" }}>
        Continue with <span style={{ fontWeight: 700 }}>Google</span>
      </span>
    </Button>
  );
};

export default LoginWithGoogle;

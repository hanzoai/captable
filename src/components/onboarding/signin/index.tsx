"use client";

import { Button } from "@hanzo/ui";
import { signIn } from "next-auth/react";
import { AuthFormHeader } from "../auth-form-header";

const IAM_PROVIDER_NAME =
	process.env.NEXT_PUBLIC_IAM_PROVIDER_NAME || "Hanzo";

const SignInForm = () => {
	async function signInWithIAM() {
		await signIn("hanzo-iam", { callbackUrl: "/onboarding" });
	}

	return (
		<div className="auth-screen">
			<div className="auth-card">
				<AuthFormHeader page="signin" />
				<Button type="button" onClick={signInWithIAM}>
					Sign in with{" "}
					<span style={{ fontWeight: 700 }}>{IAM_PROVIDER_NAME}</span>
				</Button>
			</div>
		</div>
	);
};

export default SignInForm;

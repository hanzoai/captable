"use client";

import { Button } from "@hanzo/ui";
import { signIn } from "next-auth/react";
import { AuthFormHeader } from "../auth-form-header";

const IAM_PROVIDER_NAME =
	process.env.NEXT_PUBLIC_IAM_PROVIDER_NAME || "Hanzo";

const SignUpForm = () => {
	async function signInWithIAM() {
		await signIn("hanzo-iam", { callbackUrl: "/onboarding" });
	}

	return (
		<div className="auth-screen">
			<div className="auth-card">
				<AuthFormHeader page="signup" />
				<Button type="button" onClick={signInWithIAM}>
					Sign up with{" "}
					<span style={{ fontWeight: 700 }}>{IAM_PROVIDER_NAME}</span>
				</Button>
				<span
					style={{
						textAlign: "center",
						fontSize: "0.875rem",
						color: "#6b7280",
					}}
				>
					Already have an account?{" "}
					<a href="/login" className="link-underline">
						Login
					</a>
				</span>
			</div>
		</div>
	);
};

export default SignUpForm;

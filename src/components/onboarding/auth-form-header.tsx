import { CaptableLogo } from "@/components/common/logo";
import { APP_NAME } from "@/lib/branding";

interface LoginFormHeaderProps {
  page?: string;
}

export function AuthFormHeader({ page }: LoginFormHeaderProps) {
  return (
    <div className="auth-head">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <CaptableLogo
          style={{ marginBottom: "0.75rem", height: "2.5rem", width: "auto" }}
        />
      </div>

      <h1 className="auth-title" style={{ marginBottom: "0.5rem" }}>
        {page === "signup" ? `Signup to ${APP_NAME}` : `Login to ${APP_NAME}`}
      </h1>
    </div>
  );
}

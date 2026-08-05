import { env } from "@/env";
import { getServerComponentAuthSession } from "@/server/auth";
import { RiCheckboxCircleFill as CheckIcon } from "@remixicon/react";

import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import LoginWithGoogle from "./components/LoginWithGoogle";

const check = (
  <CheckIcon
    size={20}
    style={{
      display: "inline-block",
      marginBottom: "0.25rem",
      color: "#22c55e",
    }}
  />
);

const li: React.CSSProperties = { marginBottom: "0.25rem" };
const item: React.CSSProperties = { marginLeft: "0.5rem" };

export default async function CapPage() {
  if (env.NEXTAUTH_URL && !env.NEXTAUTH_URL.includes("captable.hanzo.ai")) {
    return notFound();
  }

  const session = await getServerComponentAuthSession();

  if (session?.user) {
    return redirect("/company/new");
  }

  return (
    <div className="auth-screen">
      <div
        className="auth-card"
        style={{ maxWidth: "32rem", background: "rgb(255 255 255 / 0.1)" }}
      >
        <h3 style={{ marginTop: "-1.25rem" }}>
          cap.
          <span style={{ fontSize: "1.5rem", color: "#4b5563" }}>new</span>
        </h3>
        <ul>
          <li style={li}>
            {check}
            <span style={item}>Manage your Cap table, issue options</span>
          </li>
          <li style={li}>
            {check}
            <span style={item}>Collaborate with investors with Data rooms</span>
          </li>
          <li style={li}>
            {check}
            <span style={item}>eSign NDAs, SAFEs and other documents</span>
          </li>
          <li style={li}>
            {check}
            <span style={item}>Delight your investors by sending updates</span>
          </li>
        </ul>
        <span style={{ fontSize: "1.25rem" }}>Login to get started</span>
        <LoginWithGoogle />
      </div>
    </div>
  );
}

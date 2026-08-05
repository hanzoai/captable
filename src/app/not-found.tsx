"use client";

import { Button } from "@hanzo/ui";
import { useRouter } from "next/navigation";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div
      className="center"
      style={{
        height: "100vh",
        width: "100%",
        flexDirection: "column",
        background: "#fff",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(8rem, 12vw, 150px)",
          fontWeight: 800,
          letterSpacing: "0.1em",
          color: "#111827",
        }}
      >
        404
      </h1>
      <div
        style={{
          padding: "0 1rem 0.5rem",
          fontSize: "0.875rem",
          color: "#000",
        }}
      >
        The page you are looking for does not exist
      </div>
      <Button variant="outline" onClick={() => router.back()}>
        Go back
      </Button>
    </div>
  );
}

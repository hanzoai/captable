"use client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@hanzo/ui";
import { CaptableLogo } from "@/components/common/logo";

export type ModalProps = {
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  children: React.ReactNode;
  scrollable?: boolean;
};

const maxWidths: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "24rem",
  md: "28rem",
  lg: "32rem",
  xl: "36rem",
  "2xl": "42rem",
  "3xl": "48rem",
  "4xl": "56rem",
  "5xl": "64rem",
};

const Modal = ({
  title,
  subtitle,
  size = "md",
  scrollable = true,
  children,
}: ModalProps) => {
  return (
    <DialogContent
      style={{
        margin: "2.5rem 0",
        gap: 0,
        background: "#fff",
        padding: 0,
        maxWidth: maxWidths[size],
      }}
    >
      <div
        className="no-scrollbar"
        style={{
          maxHeight: "80vh",
          overflow: scrollable ? "scroll" : undefined,
        }}
      >
        <header
          style={{ borderBottom: "1px solid #e5e7eb", padding: "1.25rem" }}
        >
          <div>
            <DialogHeader>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CaptableLogo
                  style={{
                    marginBottom: "0.75rem",
                    height: "2.5rem",
                    width: "2.5rem",
                    borderRadius: "0.25rem",
                  }}
                />
              </div>
              <DialogTitle style={{ marginBottom: "1rem", textAlign: "center" }}>
                {title}
              </DialogTitle>
              {subtitle && (
                <DialogDescription style={{ textAlign: "center" }}>
                  {subtitle}
                </DialogDescription>
              )}
            </DialogHeader>
          </div>
        </header>

        <section style={{ background: "#f3f4f6", padding: "1.25rem 2rem" }}>
          <div>{children}</div>
        </section>
      </div>
    </DialogContent>
  );
};

export default Modal;

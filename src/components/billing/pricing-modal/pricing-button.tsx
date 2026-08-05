import { cn } from "@hanzo/ui";
import type { ComponentProps } from "react";

interface PricingButtonProps
  extends Omit<ComponentProps<"button">, "children"> {
  label: string;
  active: boolean;
}

export function PricingButton({
  label,
  active,
  className,
  ...rest
}: PricingButtonProps) {
  return (
    <button
      className={cn(className)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        whiteSpace: "nowrap",
        borderRadius: "0.125rem",
        border: "none",
        cursor: "pointer",
        padding: "0.375rem 0.75rem",
        fontSize: "0.875rem",
        fontWeight: 500,
        transition: "all 0.15s ease",
        ...(active
          ? {
              background: "var(--background)",
              color: "var(--foreground)",
              boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
            }
          : { background: "transparent", color: "inherit" }),
      }}
      {...rest}
    >
      {label}
    </button>
  );
}

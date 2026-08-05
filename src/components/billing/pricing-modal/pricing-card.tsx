import { Button, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@hanzo/ui";
import type { ButtonProps } from "@hanzo/ui";
import type { PricingPlanInterval } from "@/prisma/enums";
import { useState } from "react";

interface PricingCardProps {
  title: string;
  description?: string | null;
  price: string;
  interval: PricingPlanInterval;
  subscribedUnitAmount?: bigint | null;
  unitAmount: number;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  handleClick?: () => Promise<any>;
  isSubmitting: boolean;
}

const humanizedInterval: Record<PricingPlanInterval, string> = {
  day: "Daily",
  month: "Monthly",
  week: "Weekly",
  year: "Yearly",
};

export function PricingCard({
  description,
  title,
  interval,
  price,
  subscribedUnitAmount: subscribedUnitAmount_,
  unitAmount,
  handleClick,
  isSubmitting,
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const subscribedUnitAmount = subscribedUnitAmount_
    ? Number(subscribedUnitAmount_)
    : null;

  const active = unitAmount === subscribedUnitAmount;

  return (
    <Card>
      <CardHeader>
        <CardTitle style={{ fontSize: "1.125rem" }}>{title}</CardTitle>
        <div style={{ display: "flex", gap: "0.125rem" }}>
          <h3 style={{ fontSize: "1.875rem", fontWeight: 700 }}>{price}</h3>
          {unitAmount !== 0 && (
            <span
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                fontSize: "0.875rem",
                marginBottom: "0.25rem",
              }}
            >
              /{humanizedInterval[interval]}
            </span>
          )}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          {...(active && { variant: "destructive" })}
          onClick={async () => {
            if (handleClick) {
              setIsLoading(true);
              await handleClick();
              setIsLoading(false);
            }
          }}
          loading={isLoading}
          {...(!isLoading && { disabled: isSubmitting })}
          {...(unitAmount === 0 && !subscribedUnitAmount && { disabled: true })}
        >
          {subscribedUnitAmount
            ? unitAmount < subscribedUnitAmount
              ? "Downgrade Plan"
              : unitAmount > subscribedUnitAmount
                ? "Upgrade Plan"
                : "Cancel Current Plan"
            : !subscribedUnitAmount && unitAmount === 0
              ? "Active plan"
              : "Subscribe"}
        </Button>
      </CardFooter>
    </Card>
  );
}

import { Popover, PopoverContent, PopoverTrigger } from "@hanzo/ui";
import { COLORS, FIELD_FILL_ALPHA } from "@/constants/esign";
import { cn } from "@hanzo/ui";
import type { ComponentProps, ReactNode } from "react";

const fieldPaint = (color: string): React.CSSProperties => {
  const c = COLORS[color as keyof typeof COLORS];
  return {
    border: `2px solid ${c}`,
    background: c && `${c}${FIELD_FILL_ALPHA}`,
  };
};

interface useMeasurementProps {
  currentViewportHeight: number;
  viewportHeight: number;
  currentViewportWidth: number;
  viewportWidth: number;
  left: number;
  top: number;
  height: number;
  width: number;
}

function useMeasurement({
  currentViewportHeight,
  currentViewportWidth,
  height,
  left,
  top,
  viewportHeight,
  viewportWidth,
  width,
}: useMeasurementProps) {
  const heightRatio = currentViewportHeight / viewportHeight;
  const widthRatio = currentViewportWidth / viewportWidth;

  return {
    left: widthRatio * left,
    top: heightRatio * top,
    height: heightRatio * height,
    width: widthRatio * width,
  };
}

export type ReadOnlyTemplateFieldContainerProps = useMeasurementProps &
  ComponentProps<"div"> & { color: string };

export function ReadOnlyTemplateFieldContainer({
  currentViewportHeight,
  currentViewportWidth,
  height,
  left,
  top,
  viewportHeight,
  viewportWidth,
  width,
  className,
  children,
  color,
  ...rest
}: ReadOnlyTemplateFieldContainerProps) {
  const {
    height: newHeight,
    left: newLeft,
    top: newTop,
    width: newWidth,
  } = useMeasurement({
    currentViewportHeight,
    viewportHeight,
    currentViewportWidth,
    viewportWidth,
    height,
    left,
    top,
    width,
  });
  return (
    <div
      className={cn(className)}
      style={{
        position: "absolute",
        zIndex: 20,
        display: "flex",
        cursor: "pointer",
        alignItems: "center",
        overflow: "hidden",
        ...fieldPaint(color),
        left: newLeft,
        top: newTop,
        width: newWidth,
        height: newHeight,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TemplateFieldContainerProps
  extends ComponentProps<"button">,
    useMeasurementProps {
  children: ReactNode;
  color: string;
}

export function TemplateFieldContainer({
  currentViewportHeight,
  viewportHeight,
  currentViewportWidth,
  viewportWidth,
  height,
  left,
  top,
  width,
  children,
  className,
  color,
  ...rest
}: TemplateFieldContainerProps) {
  const {
    height: newHeight,
    left: newLeft,
    top: newTop,
    width: newWidth,
  } = useMeasurement({
    currentViewportHeight,
    viewportHeight,
    currentViewportWidth,
    viewportWidth,
    height,
    left,
    top,
    width,
  });

  return (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <button
          className={cn(className)}
          style={{
            position: "absolute",
            zIndex: 20,
            cursor: "pointer",
            borderRadius: "0.25rem",
            ...fieldPaint(color),
            left: newLeft,
            top: newTop,
            width: newWidth,
            height: newHeight,
          }}
          {...rest}
        />
      </PopoverTrigger>
      <PopoverContent>{children}</PopoverContent>
    </Popover>
  );
}

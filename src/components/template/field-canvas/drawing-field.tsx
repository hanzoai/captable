import { COLORS, FIELD_FILL_ALPHA } from "@/constants/esign";

interface DrawingFieldProps {
  color: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export function DrawingField({
  color,
  height,
  left,
  top,
  width,
}: DrawingFieldProps) {
  const c = COLORS[color as keyof typeof COLORS];

  return (
    <div
      style={{
        position: "absolute",
        overflow: "visible",
        border: `2px solid ${c}`,
        background: c && `${c}${FIELD_FILL_ALPHA}`,
        left,
        top,
        width,
        height,
      }}
    />
  );
}

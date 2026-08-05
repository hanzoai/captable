// Recipient highlight colors for the e-sign field canvas.
// Plain hex values; fields paint border at full strength and fill at 30%.
export const COLORS = {
  teal: "#2dd4bf",
  sky: "#38bdf8",
  purple: "#c084fc",
  rose: "#fb7185",
  blue: "#60a5fa",
  green: "#4ade80",
  yellow: "#facc15",
  red: "#f87171",
  indigo: "#818cf8",
  pink: "#f472b6",
  cyan: "#22d3ee",
  orange: "#fb923c",
  lime: "#a3e635",
  amber: "#fbbf24",
  emerald: "#34d399",
  violet: "#a78bfa",
} as const;

// 30% alpha suffix for 8-digit hex colors.
export const FIELD_FILL_ALPHA = "4d";

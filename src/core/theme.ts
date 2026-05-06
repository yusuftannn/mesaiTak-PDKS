export const colors = {
  primary: "#14B8A6",
  primaryDark: "#0F766E",
  secondary: "#0F172A",
  accent: "#EF4444",
  background: "#F8FAFC",
  border: "#E2E8F0",
  textPrimary: "#1E293B",
  textSecondary: "#64748B",

  surface: "#FFFFFF",
  primarySoft: "#CCFBF1",
  primaryMuted: "#99F6E4",
  accentSoft: "#FEE2E2",
  accentMuted: "#FCA5A5",
  success: "#14B8A6",
  successSoft: "#CCFBF1",
  warning: "#F59E0B",
  warningSoft: "#FEF3C7",
  overlay: "rgba(15,23,42,0.42)",
  onPrimary: "#FFFFFF",
  onSecondary: "#FFFFFF",
} as const;

export type AppColor = keyof typeof colors;

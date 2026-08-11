export const colors = {
  black: "#000000",
  primary: "#00FB5E",
  primaryDim: "rgba(0,251,94,0.14)",
  light: "#EEEEEE",
  lightDim: "rgba(238,238,238,0.55)",
  lightMuted: "rgba(238,238,238,0.35)",
  surface: "#0A0A0A",
  surface2: "#111111",
  danger: "#FF4040",
  live: "#FF4040",
} as const;

export function withBrand(brand?: string | null) {
  const c = brand?.trim();
  if (c && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(c)) return c;
  return colors.primary;
}

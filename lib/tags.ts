export type ActionKind = "goal" | "defesa" | "penalti";

export function resolveActionKind(
  iconName?: string | null,
  slug?: string | null,
): ActionKind | null {
  const blob = `${iconName || ""} ${slug || ""}`.toLowerCase();
  if (!blob.trim()) return null;
  if (blob.includes("penalti") || blob.includes("penalty") || blob.includes("pênalti")) {
    return "penalti";
  }
  if (blob.includes("defesa") || blob.includes("save") || blob.includes("luva")) {
    return "defesa";
  }
  if (
    blob.includes("goal") ||
    blob.includes("gol") ||
    blob.includes("bola") ||
    blob.includes("actions/goal")
  ) {
    return "goal";
  }
  return null;
}

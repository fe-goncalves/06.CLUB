export function displayShortName(entity?: {
  name?: string | null;
  short_name?: string | null;
  abbreviation?: string | null;
} | null) {
  if (!entity) return "—";
  return (
    entity.short_name?.trim() ||
    entity.abbreviation?.trim() ||
    entity.name?.trim() ||
    "—"
  );
}

export function formatMatchDate(dateStr: string | null | undefined) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export function formatScore(
  status: string | null | undefined,
  home: number | null | undefined,
  away: number | null | undefined,
) {
  if (status === "scheduled") return "vs";
  return `${home ?? 0}:${away ?? 0}`;
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const CODE_RE = /^[A-Z0-9]{5}$/i;

export function normalizeMatchRef(raw: string): { kind: "uuid" | "code"; value: string } | null {
  const text = raw.trim();
  if (!text) return null;

  const fromPath = text.match(/\/(?:m|match)\/([A-Za-z0-9-]{5,36})/i);
  const token = (fromPath?.[1] || text).trim();

  if (UUID_RE.test(token)) return { kind: "uuid", value: token.toLowerCase() };
  if (CODE_RE.test(token)) return { kind: "code", value: token.toUpperCase() };
  return null;
}

export function matchSharePath(publicCode: string | null | undefined, id: string) {
  const code = publicCode?.trim();
  if (code && CODE_RE.test(code)) return `/m/${code.toUpperCase()}`;
  return `/m/${id}`;
}

export function videoSharePath(
  publicCode: string | null | undefined,
  id: string,
  videoId: string,
) {
  return `${matchSharePath(publicCode, id)}/video/${videoId}`;
}

export function videoDownloadName(publicCode: string | null | undefined, index: number) {
  const code = (publicCode || "MATCH").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8) || "MATCH";
  return `${code}_${String(index + 1).padStart(3, "0")}.mov`;
}

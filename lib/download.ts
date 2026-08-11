const COOLDOWN_MS = 45_000;
const PREFIX = "06club.dl.";

export type DownloadGuardResult =
  | { ok: true }
  | { ok: false; retryInMs: number };

export function canDownloadVideo(videoId: string): DownloadGuardResult {
  if (typeof window === "undefined") return { ok: true };
  try {
    const raw = localStorage.getItem(PREFIX + videoId);
    if (!raw) return { ok: true };
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return { ok: true };
    const elapsed = Date.now() - ts;
    if (elapsed >= COOLDOWN_MS) return { ok: true };
    return { ok: false, retryInMs: COOLDOWN_MS - elapsed };
  } catch {
    return { ok: true };
  }
}

export function markVideoDownloaded(videoId: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PREFIX + videoId, String(Date.now()));
  } catch {
    // ignore quota
  }
}

/** Baixa o arquivo com nome controlado. No mobile, o browser salva em Downloads/Fotos. */
export async function downloadVideoFile(url: string, filename: string) {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("URL inválida");
  }
  if (parsed.protocol !== "https:") throw new Error("URL insegura");

  const safeName = filename.replace(/[^\w.\-]+/g, "_").slice(0, 120);
  const res = await fetch(parsed.toString(), { mode: "cors", cache: "force-cache", credentials: "omit" });
  if (!res.ok) throw new Error("Falha ao baixar vídeo");
  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = safeName;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objectUrl);
}

export async function shareOrCopy(title: string, url: string) {
  try {
    const parsed = new URL(url, typeof window !== "undefined" ? window.location.origin : "https://localhost");
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "failed" as const;
    url = parsed.toString();
  } catch {
    return "failed" as const;
  }

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title, url, text: title });
      return;
    } catch {
      // fall through
    }
  }
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return "copied" as const;
  }
  return "failed" as const;
}

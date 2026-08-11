/** URL comprimida para exibição; original só para download. */
export function playbackUrl(video: {
  r2_url: string;
  r2_url_original?: string | null;
}) {
  return video.r2_url || video.r2_url_original || "";
}

export function downloadUrl(video: {
  r2_url: string;
  r2_url_original?: string | null;
}) {
  return video.r2_url_original || video.r2_url;
}

const CACHE_NAME = "06club-video-v1";

/** Prefetch + Cache API para o próximo scroll ficar fluido. */
export async function warmVideoCache(url: string) {
  if (typeof window === "undefined" || !url || !("caches" in window)) return;
  try {
    const cache = await caches.open(CACHE_NAME);
    const hit = await cache.match(url);
    if (hit) return;
    const res = await fetch(url, { mode: "cors", credentials: "omit", cache: "force-cache" });
    if (res.ok) await cache.put(url, res.clone());
  } catch {
    // ignore network/CORS
  }
}

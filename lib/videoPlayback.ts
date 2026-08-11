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

/**
 * Prefetch leve: só abre conexão / metadados, sem baixar o arquivo inteiro.
 * (Antes fazíamos fetch completo de .mov ~14MB — isso travava a rede.)
 */
export function warmVideoHint(url: string) {
  if (typeof document === "undefined" || !url) return;
  try {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "video";
    link.href = url;
    link.setAttribute("fetchpriority", "low");
    document.head.appendChild(link);
    window.setTimeout(() => link.remove(), 12_000);
  } catch {
    // ignore
  }
}

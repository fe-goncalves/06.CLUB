/** URL pública do site. No client, depende de inline no build (Build vars no CF). */
export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

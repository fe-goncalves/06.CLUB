import { NextResponse, type NextRequest } from "next/server";

/**
 * Rate limit simples em memória (por instância).
 * Em Cloudflare Pages / multi-edge, complemente com WAF / Bot Fight / Rate Limiting.
 */
const WINDOW_MS = 60_000;
const MAX_REQ = 90;
const buckets = new Map<string, { count: number; resetAt: number }>();

function clientIp(req: NextRequest) {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function isSuspiciousPath(pathname: string) {
  const p = pathname.toLowerCase();
  return (
    p.includes("..") ||
    p.includes("%2e%2e") ||
    p.includes("wp-admin") ||
    p.includes("wp-login") ||
    p.includes(".php") ||
    p.includes("/.env") ||
    p.includes("/admin") ||
    p.includes("phpmyadmin")
  );
}

function pruneBuckets(now: number) {
  if (buckets.size < 4000) return;
  for (const [k, v] of buckets) {
    if (v.resetAt < now) buckets.delete(k);
  }
  if (buckets.size > 5000) buckets.clear();
}

function rateLimit(ip: string) {
  const now = Date.now();
  pruneBuckets(now);
  const hit = buckets.get(ip);
  if (!hit || now > hit.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true as const, remaining: MAX_REQ - 1 };
  }
  hit.count += 1;
  if (hit.count > MAX_REQ) {
    return {
      ok: false as const,
      remaining: 0,
      retryAfter: Math.ceil((hit.resetAt - now) / 1000),
    };
  }
  return { ok: true as const, remaining: MAX_REQ - hit.count };
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/fonts") ||
    pathname.startsWith("/brand") ||
    pathname.startsWith("/icons") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (isSuspiciousPath(pathname)) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const ip = clientIp(req);
  const limit = rateLimit(ip);
  if (!limit.ok) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: {
        "Retry-After": String(limit.retryAfter || 60),
        "Cache-Control": "no-store",
      },
    });
  }

  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Limit", String(MAX_REQ));
  res.headers.set("X-RateLimit-Remaining", String(Math.max(0, limit.remaining)));
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

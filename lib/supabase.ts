import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function env(name: string): string | undefined {
  const v = process.env[name];
  if (typeof v === "string" && v.trim()) return v.trim();
  return undefined;
}

export function getSupabase() {
  if (client) return client;

  const url = env("NEXT_PUBLIC_SUPABASE_URL");
  const key = env("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !key) {
    throw new Error(
      `Missing Supabase env (url=${url ? "ok" : "missing"}, key=${key ? "ok" : "missing"})`,
    );
  }

  client = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (...args: Parameters<typeof fetch>) => fetch(...args),
    },
  });

  return client;
}

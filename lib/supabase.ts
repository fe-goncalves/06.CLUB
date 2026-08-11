import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function readEnv(name: string): string | undefined {
  const fromProcess = process.env[name]?.trim();
  if (fromProcess) return fromProcess;
  return undefined;
}

async function readEnvAsync(name: string): Promise<string | undefined> {
  const sync = readEnv(name);
  if (sync) return sync;
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const ctx = await getCloudflareContext({ async: true });
    const fromCf = (ctx?.env as Record<string, string | undefined> | undefined)?.[name];
    return fromCf?.trim() || undefined;
  } catch {
    return undefined;
  }
}

export async function getSupabase() {
  if (client) return client;

  const url = await readEnvAsync("NEXT_PUBLIC_SUPABASE_URL");
  const key = await readEnvAsync("NEXT_PUBLIC_SUPABASE_ANON_KEY");

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  client = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  return client;
}

import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Anon read-only client without cookie context — safe to use inside
 * unstable_cache() since it has no per-request state.
 *
 * RLS still applies (anon role can only read is_published rows on
 * public-facing tables, no writes).
 */
export function createSupabaseAnonClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
      global: { headers: { "x-application": "senim-public" } },
    },
  );
}

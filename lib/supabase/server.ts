import "server-only";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

type CookieToSet = { name: string; value: string; options?: CookieOptions };

/**
 * Server-side Supabase client wired to Next.js cookies.
 * Use inside Server Components, Route Handlers, and Server Actions.
 *
 * Untyped on purpose: hand-rolled Database types collapse to `never` under
 * Supabase's GenericTable constraint. Once you run `pnpm db:types` against a
 * live Supabase project, regenerate `database.types.ts` and re-add the
 * <Database> generic for full type safety.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component — ignore. Middleware refreshes the session.
          }
        },
      },
    },
  );
}

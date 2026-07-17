import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client (cookie-based sessions via @supabase/ssr).
 * Only call when the supabase auth provider is active.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set when using Supabase auth",
    );
  }
  return createBrowserClient(url, key);
}

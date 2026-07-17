/**
 * Which auth backend the app runs against.
 *
 * - "supabase": Supabase Auth with GitHub/Google OAuth. The default in
 *   production. Requires NEXT_PUBLIC_SUPABASE_URL and
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * - "basic": a plain username/password form checked against
 *   BASIC_AUTH_USERNAME/BASIC_AUTH_PASSWORD (default dev/dev) that sets a
 *   cookie. The default in development, where the app runs against a local
 *   Postgres and no Supabase project is needed.
 *
 * Only NEXT_PUBLIC_* env vars are referenced so this module is safe to import
 * from client components and the edge middleware.
 */
export type AuthProviderName = "supabase" | "basic";

const configured = process.env.NEXT_PUBLIC_AUTH_PROVIDER;

export const authProvider: AuthProviderName =
  configured === "supabase" || configured === "basic"
    ? configured
    : process.env.NODE_ENV === "production"
      ? "supabase"
      : "basic";

export const isSupabaseAuth = authProvider === "supabase";

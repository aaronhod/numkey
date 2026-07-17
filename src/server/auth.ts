import { createServerClient, serializeCookieHeader } from "@supabase/ssr";
import { type IncomingMessage, type ServerResponse } from "node:http";
import { isSupabaseAuth } from "@/utils/authProvider";
import { env } from "@/env.js";

/** Request shape shared by API routes and getServerSideProps. */
export type AuthRequest = IncomingMessage & {
  cookies: Partial<Record<string, string>>;
};

export interface ServerAuth {
  userId: string | null;
}

export const BASIC_AUTH_COOKIE = "mg_basic_user";

/**
 * Supabase server client for the pages router: reads auth cookies from the
 * request and writes refreshed tokens back onto the response.
 */
export function createSupabaseServerClient(
  req: AuthRequest,
  res: ServerResponse,
) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set when using Supabase auth",
    );
  }

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return Object.entries(req.cookies).map(([name, value]) => ({
          name,
          value: value ?? "",
        }));
      },
      setAll(cookiesToSet) {
        res.setHeader(
          "Set-Cookie",
          cookiesToSet.map(({ name, value, options }) =>
            serializeCookieHeader(name, value, options),
          ),
        );
      },
    },
  });
}

/**
 * Resolve the signed-in user for a request, regardless of provider.
 * Supabase: validates the session JWT against the auth server.
 * Basic (dev): reads the username cookie set by /api/auth/basic/login.
 */
export async function getServerAuth(
  req: AuthRequest,
  res: ServerResponse,
): Promise<ServerAuth> {
  if (isSupabaseAuth) {
    const supabase = createSupabaseServerClient(req, res);
    const { data } = await supabase.auth.getUser();
    return { userId: data.user?.id ?? null };
  }

  const username = req.cookies[BASIC_AUTH_COOKIE];
  return { userId: username ? `dev:${username}` : null };
}

export function basicAuthCredentials() {
  return {
    username: env.BASIC_AUTH_USERNAME ?? "dev",
    password: env.BASIC_AUTH_PASSWORD ?? "dev",
  };
}

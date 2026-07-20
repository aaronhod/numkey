import type { NextApiRequest, NextApiResponse } from "next";
import { serializeCookieHeader } from "@supabase/ssr";
import { isSupabaseAuth } from "@/utils/authProvider";
import {
  BASIC_AUTH_COOKIE,
  basicAuthCredentials,
  signBasicCookie,
} from "@/server/auth";

const THIRTY_DAYS_S = 30 * 24 * 60 * 60;

/**
 * Dev-only basic auth: checks the posted credentials against
 * BASIC_AUTH_USERNAME/BASIC_AUTH_PASSWORD and sets the session cookie.
 */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (isSupabaseAuth) {
    return res.status(404).end();
  }
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { username, password } = (req.body ?? {}) as {
    username?: string;
    password?: string;
  };
  const expected = basicAuthCredentials();

  if (username !== expected.username || password !== expected.password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.setHeader(
    "Set-Cookie",
    serializeCookieHeader(BASIC_AUTH_COOKIE, signBasicCookie(username), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: THIRTY_DAYS_S,
    }),
  );
  return res.status(200).json({ userId: `dev:${username}` });
}

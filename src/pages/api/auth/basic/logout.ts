import type { NextApiRequest, NextApiResponse } from "next";
import { serializeCookieHeader } from "@supabase/ssr";
import { isSupabaseAuth } from "@/utils/authProvider";
import { BASIC_AUTH_COOKIE } from "@/server/auth";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (isSupabaseAuth) {
    return res.status(404).end();
  }
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  res.setHeader(
    "Set-Cookie",
    serializeCookieHeader(BASIC_AUTH_COOKIE, "", { path: "/", maxAge: 0 }),
  );
  return res.status(200).json({ ok: true });
}

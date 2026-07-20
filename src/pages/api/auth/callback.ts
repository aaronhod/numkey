import type { NextApiRequest, NextApiResponse } from "next";
import { isSupabaseAuth } from "@/utils/authProvider";
import { createSupabaseServerClient } from "@/server/auth";

/**
 * OAuth (PKCE) callback: Supabase redirects here with a `code` after the
 * GitHub/Google flow; exchange it for a session and land on the home page.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!isSupabaseAuth) {
    return res.status(404).end();
  }

  const code = req.query.code;
  if (typeof code === "string") {
    const supabase = createSupabaseServerClient(req, res);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return res.redirect(`/login?error=${encodeURIComponent(error.message)}`);
    }
  }

  return res.redirect("/");
}

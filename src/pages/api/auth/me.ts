import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuth } from "@/server/auth";

/** Session probe used by the header to decide whether to show sign-out. */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const auth = await getServerAuth(req, res);
  return res.status(200).json(auth);
}

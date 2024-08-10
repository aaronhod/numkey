import { type inferAsyncReturnType } from "@trpc/server";
import { type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { Jwt } from "hono/utils/jwt";

import { db } from "@munk/db/db";

export interface User {
  id: string;
}

export const createContext = async (
  JWT_VERIFICATION_KEY: string,
  opts: FetchCreateContextFnOptions,
) => {
  async function getUser() {
    const sessionToken = opts.req.headers.get("authorization")?.split(" ")[1];

    if (sessionToken !== undefined && sessionToken !== "undefined") {
      if (!JWT_VERIFICATION_KEY) {
        console.error("JWT_VERIFICATION_KEY is not set");
        return null;
      }

      try {
        const authorized = await Jwt.verify(
          sessionToken,
          JWT_VERIFICATION_KEY,
          "HS256",
        );
        if (!authorized) {
          return null;
        }

        const decodedToken = Jwt.decode(sessionToken);

        // Check if token is expired
        const expirationTimestamp = decodedToken.payload.exp;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (!expirationTimestamp || expirationTimestamp < currentTimestamp) {
          return null;
        }

        const userId = decodedToken?.payload?.sub;

        if (userId) {
          return {
            id: userId,
          };
        }
      } catch (e) {
        console.error(e);
      }
    }

    return null;
  }

  const user = await getUser();

  return { user, db };
};

export type Context = inferAsyncReturnType<typeof createContext>;

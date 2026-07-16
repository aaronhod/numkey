import { getAuth } from "@clerk/nextjs/server";
import { authDisabled, DEV_USER_ID } from "@/utils/authDisabled";

type GetAuthReq = Parameters<typeof getAuth>[0];

/**
 * getAuth() throws when clerkMiddleware didn't run, so when auth is
 * disabled we return a stub auth object for the dev user instead.
 */
export const getAuthOrDev = (req: GetAuthReq): ReturnType<typeof getAuth> =>
  authDisabled
    ? ({ userId: DEV_USER_ID } as unknown as ReturnType<typeof getAuth>)
    : getAuth(req);

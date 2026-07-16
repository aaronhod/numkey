/**
 * Temporary escape hatch for local development without Clerk keys.
 * Set NEXT_PUBLIC_DISABLE_AUTH=1 (e.g. in .env.dev) to skip all auth:
 * middleware lets every route through and the server treats requests as
 * a fake "dev-user". Never enable in production.
 */
export const authDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === "1";

export const DEV_USER_ID = "dev-user";

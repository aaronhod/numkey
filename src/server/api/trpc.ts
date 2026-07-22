import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";

import { getDb } from "@/server/db";
import { getServerAuth, type ServerAuth } from "@/server/auth";

type AuthContextProps = {
  auth?: ServerAuth;
};

export const createContextInner = async ({ auth }: AuthContextProps) => {
  return {
    auth,
    db: getDb(),
  };
};

/**
 * Per-request context for the tRPC endpoint (`/api/trpc`): resolves the
 * caller's auth and hands out the request's database client.
 */
export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const contextInner = await createContextInner({
    auth: await getServerAuth(opts.req, opts.res),
  });

  return {
    ...contextInner,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    // Narrow userId to a non-null string for downstream resolvers.
    ctx: {
      auth: { userId: ctx.auth.userId },
    },
  });
});

export const createTRPCRouter = t.router;

/** Procedure callable without a session. */
export const publicProcedure = t.procedure;

/** Procedure that rejects unauthenticated callers with UNAUTHORIZED. */
export const protectedProcedure = t.procedure.use(isAuthed);

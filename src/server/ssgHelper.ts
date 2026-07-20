import { appRouter } from "@/server/api/root";
import { createContextInner } from "@/server/api/trpc";
import { getServerAuth } from "@/server/auth";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { type GetServerSidePropsContext } from "next/types";
import superjson from "superjson";

export const ssgHelper = async (ctx: GetServerSidePropsContext) =>
  createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner({
      auth: await getServerAuth(ctx.req, ctx.res),
    }),
    transformer: superjson,
  });

export const staticHelper = async () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner({}),
    transformer: superjson,
  });

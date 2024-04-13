import { appRouter } from "@/server/api/root";
import { createContextInner } from "@/server/api/trpc";
import { getAuth } from "@clerk/nextjs/server";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { type GetServerSidePropsContext } from "next/types";
import superjson from "superjson";

export const ssgHelper = async (ctx: GetServerSidePropsContext) =>
  createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner({ auth: getAuth(ctx.req) }),
    transformer: superjson,
  });

export const staticHelper = async () =>
  createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner({}),
    transformer: superjson,
  });

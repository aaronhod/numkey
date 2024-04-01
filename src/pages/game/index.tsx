import { createServerSideHelpers } from "@trpc/react-query/server";
import superjson from "superjson";

import type { ParsedUrlQuery } from "querystring";
import type { GameSettings } from "@/components/views/Game";
import Game from "src/components/views/Game";
import { generateProblems, Operator, Problem } from "@/components/game/problem";
import type {
  GameMode,
  GameModifierName,
} from "@/components/views/GameSettings";
import { redirect } from "next/navigation";
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";
import { buildClerkProps, clerkClient, getAuth } from "@clerk/nextjs/server";
import { appRouter } from "@/server/api/root";
import { createContextInner } from "@/server/api/trpc";

interface Query {
  gameId: string;
  gameMode: GameMode;
}

interface ParsedQueryParams extends ParsedUrlQuery, Query {
  numbers: string[] | string;
  operators: string[] | string;
  nextOnFail: string;
  modifiers: string;
}

interface QueryParams extends Query {
  numbers: number[];
  operators: Operator[];
  nextOnFail: boolean;
  modifiers: GameModifierName[];
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
  const user = userId ? await clerkClient.users.getUser(userId) : undefined;

  if (!user || !userId) {
    redirect("/");
  }

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner({ auth: getAuth(ctx.req) }),
    transformer: superjson,
  });

  const parsedQuery: QueryParams = parseQueryParams(ctx.query);
  const problems = (await helpers.game.findProblemsByDomainProblems.fetch({
    problems: generateProblems(parsedQuery.numbers, parsedQuery.operators),
  })) as Problem[];

  const gameSettings = {
    gameMode: parsedQuery.gameMode,
    gameModifiers: {
      random: {
        enabled: parsedQuery.modifiers.includes("random"),
      },
      timed: {
        enabled: parsedQuery.modifiers.includes("timed"),
        durationSeconds: 10,
      },
      shuffled: {
        enabled: parsedQuery.modifiers.includes("shuffled"),
      },
    },
  };

  // Load any data your application needs for the page using the userId
  return {
    props: {
      ...buildClerkProps(ctx.req),
      userId: userId,
      problems: problems,
      settings: gameSettings,
      trpcState: helpers.dehydrate(),
    } satisfies Props,
  };
};

function parseQueryParams(query: ParsedUrlQuery): QueryParams {
  const parsedQuery = query as ParsedQueryParams;
  const numbers = Array.isArray(parsedQuery.numbers)
    ? parsedQuery.numbers.map((num) => Number(num))
    : [Number(parsedQuery.numbers)];
  const operators = Array.isArray(parsedQuery.operators)
    ? (parsedQuery.operators as Operator[])
    : [parsedQuery.operators as Operator];
  const nextOnFail = parsedQuery.nextOnFail === "true";
  const modifiers = parsedQuery.modifiers.split(",") as GameModifierName[];

  return {
    ...parsedQuery,
    operators,
    numbers,
    nextOnFail,
    modifiers,
  };
}

type Props = {
  userId: string;
  problems: Problem[];
  settings: GameSettings;
} & InferGetServerSidePropsType<typeof getServerSideProps>;

export default function RunningGame({
  userId,
  problems,
  settings,
}: Readonly<Props>) {
  if (!problems || !settings) {
    return null;
  }

  return (
    <Game userId={userId} initialProblems={problems} settings={settings} />
  );
}

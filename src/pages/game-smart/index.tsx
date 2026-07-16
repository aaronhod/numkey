import type { ParsedUrlQuery } from "querystring";
import Game from "src/components/views/Game";
import {
  generateProblems,
  OPERATORS,
  type Operator,
  type Problem,
} from "@/game/problem";
import type {
  GameMode,
  GameModifierName,
  GameSettings,
} from "@/components/views/GameSettings";
import { redirect } from "next/navigation";
import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";
import { buildClerkProps, clerkClient } from "@clerk/nextjs/server";
import { hashProblemDefs } from "@/utils/hash";
import { ssgHelper } from "@/server/ssgHelper";
import { getAuthOrDev } from "@/server/devAuth";
import { authDisabled } from "@/utils/authDisabled";

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
  const { userId } = getAuthOrDev(ctx.req);
  if (!userId) {
    redirect("/");
  }
  if (!authDisabled) {
    const user = await (await clerkClient()).users.getUser(userId);
    if (!user) {
      redirect("/");
    }
  }

  const parsedQuery = parseQueryParams(ctx.query);
  if (!parsedQuery) {
    // Missing or invalid game settings — send the user to the setup screen.
    return {
      redirect: { destination: "/game-custom", permanent: false },
    };
  }

  const helpers = await ssgHelper(ctx);
  const problemHashes = await hashProblemDefs(
    generateProblems(parsedQuery.numbers, parsedQuery.operators),
  );
  const problems = await helpers.game.findProblemsByHash.fetch(problemHashes);

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
      ...(authDisabled ? {} : buildClerkProps(ctx.req)),
      userId: userId,
      problems: problems,
      settings: gameSettings,
      trpcState: helpers.dehydrate(),
    } satisfies Props,
  };
};

// Query values arrive either as repeated params (string[]) or as a single
// comma-joined string (how getGameRouteCustom serializes arrays).
function toArray(value: string[] | string | undefined): string[] {
  const values = Array.isArray(value) ? value : (value ?? "").split(",");
  return values.filter(Boolean);
}

function parseQueryParams(query: ParsedUrlQuery): QueryParams | null {
  const parsedQuery = query as ParsedQueryParams;
  const numbers = toArray(parsedQuery.numbers)
    .map((num) => Number(num))
    .filter((num) => !Number.isNaN(num));
  const operators = toArray(parsedQuery.operators).filter((op) =>
    OPERATORS.includes(op as Operator),
  ) as Operator[];

  if (numbers.length === 0 || operators.length === 0) {
    return null;
  }

  const nextOnFail = parsedQuery.nextOnFail === "true";
  const modifiers = toArray(parsedQuery.modifiers) as GameModifierName[];

  return {
    ...parsedQuery,
    gameMode: parsedQuery.gameMode ?? "normal",
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
    <Game
      userId={userId}
      category="SMART"
      route="game-smart"
      initialProblems={problems}
      settings={settings}
    />
  );
}
